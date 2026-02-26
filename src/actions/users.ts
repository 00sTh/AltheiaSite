"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

// ─── Auth guard ─────────────────────────────────────────────────────────────

async function requireAdmin() {
  const { userId, sessionClaims } = await getServerAuth();
  if (!userId) redirect("/sign-in");
  const role = sessionClaims?.metadata?.role;
  if (role !== "admin") redirect("/");
}

// ─── List users ──────────────────────────────────────────────────────────────

export async function getAdminUsers(search?: string) {
  await requireAdmin();

  const isPostgres = (process.env.DATABASE_URL ?? "").startsWith("postgres");

  const users = await prisma.userProfile.findMany({
    where: search
      ? {
          OR: [
            {
              email: {
                contains: search,
                ...(isPostgres && { mode: "insensitive" as const }),
              },
            },
            {
              firstName: {
                contains: search,
                ...(isPostgres && { mode: "insensitive" as const }),
              },
            },
            {
              lastName: {
                contains: search,
                ...(isPostgres && { mode: "insensitive" as const }),
              },
            },
          ],
        }
      : undefined,
    include: {
      _count: { select: { orders: true } },
      orders: {
        select: { price: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return users.map((u) => ({
    id: u.id,
    clerkId: u.clerkId,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt,
    orderCount: u._count.orders,
    totalSpent: u.orders.reduce((acc, o) => acc + Number(o.price), 0),
    paidOrderCount: u.orders.filter((o) => o.status === "PAID").length,
  }));
}

// ─── Get user detail ─────────────────────────────────────────────────────────

export async function getAdminUser(id: string) {
  await requireAdmin();

  const user = await prisma.userProfile.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: { select: { name: true, slug: true, images: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return user;
}

// ─── Set admin role (production Clerk only) ──────────────────────────────────

export async function setUserAdminRole(
  clerkId: string,
  makeAdmin: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const DEMO_MODE = process.env.DEMO_MODE === "true";
  if (DEMO_MODE) {
    return {
      success: false,
      error: "Gerenciamento de roles disponível apenas em produção (Clerk).",
    };
  }

  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: { role: makeAdmin ? "admin" : "customer" },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("Clerk setRole error:", err);
    return { success: false, error: "Erro ao atualizar role no Clerk." };
  }
}

// ─── Delete user ─────────────────────────────────────────────────────────────

export async function deleteAdminUser(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const user = await prisma.userProfile.findUnique({
    where: { id },
    include: { _count: { select: { orders: true } } },
  });

  if (!user) return { success: false, error: "Usuário não encontrado." };
  if (user._count.orders > 0) {
    return {
      success: false,
      error: "Não é possível excluir usuário com pedidos.",
    };
  }

  await prisma.userProfile.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}
