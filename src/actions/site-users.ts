"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getServerAuth } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email-verify";

// ─── Auth guard ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const { userId, sessionClaims } = await getServerAuth();
  if (!userId) redirect("/admin/login");
  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") redirect("/");
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const createUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_.-]+$/, "Apenas letras minúsculas, números, _ . -"),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  role: z.enum(["USER", "ADMIN"]),
});

const updateUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_.-]+$/)
    .optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(72).optional().or(z.literal("")),
  role: z.enum(["USER", "ADMIN"]).optional(),
  active: z.coerce.boolean().optional(),
});

// ─── List ─────────────────────────────────────────────────────────────────────

export async function getAdminSiteUsers(search?: string) {
  await requireAdmin();

  const isPostgres = (process.env.DATABASE_URL ?? "").startsWith("postgres");

  return prisma.siteUser.findMany({
    where: search
      ? {
          OR: [
            {
              username: {
                contains: search,
                ...(isPostgres && { mode: "insensitive" as const }),
              },
            },
            {
              email: {
                contains: search,
                ...(isPostgres && { mode: "insensitive" as const }),
              },
            },
          ],
        }
      : undefined,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      active: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSiteUser(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = createUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { username, email, password, role } = parsed.data;

  const exists = await prisma.siteUser.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (exists) {
    return {
      success: false,
      error: "Username ou email já cadastrado.",
    };
  }

  const passwordHash = await hashPassword(password);

  const newUser = await prisma.siteUser.create({
    data: { username, email, passwordHash, role },
  });

  // Enviar email de verificação (loga no console se SMTP não configurado)
  await sendVerificationEmail(newUser.id, email, username).catch((err) =>
    console.error("Erro ao enviar email de verificação:", err)
  );

  revalidatePath("/admin/users");
  return { success: true };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateSiteUser(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = updateUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { password, ...rest } = parsed.data;

  const data: Record<string, unknown> = { ...rest };
  if (password) {
    data.passwordHash = await hashPassword(password);
  }

  const oldUser = await prisma.siteUser.findUnique({
    where: { id },
    select: { email: true, username: true },
  });

  const updated = await prisma.siteUser.update({ where: { id }, data });

  // Se o email mudou, enviar nova verificação
  const newEmail = typeof rest.email === "string" ? rest.email : null;
  if (newEmail && oldUser && newEmail !== oldUser.email) {
    await sendVerificationEmail(id, newEmail, oldUser.username).catch((err) =>
      console.error("Erro ao enviar email de verificação:", err)
    );
  }

  void updated;
  revalidatePath("/admin/users");
  return { success: true };
}

// ─── Resend verification email ────────────────────────────────────────────────

export async function resendVerificationEmail(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const user = await prisma.siteUser.findUnique({
    where: { id },
    select: { email: true, username: true, emailVerified: true },
  });

  if (!user) return { success: false, error: "Usuário não encontrado." };
  if (user.emailVerified) return { success: false, error: "E-mail já verificado." };

  await sendVerificationEmail(id, user.email, user.username);
  return { success: true };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSiteUser(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  // Não permite excluir o último admin
  const user = await prisma.siteUser.findUnique({
    where: { id },
    select: { role: true },
  });

  if (!user) return { success: false, error: "Usuário não encontrado." };

  if (user.role === "ADMIN") {
    const adminCount = await prisma.siteUser.count({
      where: { role: "ADMIN", active: true },
    });
    if (adminCount <= 1) {
      return {
        success: false,
        error: "Não é possível excluir o único administrador.",
      };
    }
  }

  await prisma.siteUser.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}
