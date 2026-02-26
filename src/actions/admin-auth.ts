"use server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { setSession, clearSession } from "@/lib/session";

const DEMO_MODE = process.env.DEMO_MODE === "true";

/** Login do admin — verifica SiteUser com role ADMIN */
export async function adminDemoLogin(
  formData: FormData
): Promise<{ success: boolean; error?: string; warning?: string }> {
  if (!DEMO_MODE) {
    return { success: false, error: "Use o login Clerk em produção." };
  }

  const username = ((formData.get("username") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";

  if (!username || !password) {
    return { success: false, error: "Preencha usuário e senha." };
  }

  const user = await prisma.siteUser.findFirst({
    where: {
      OR: [{ username }, { email: username }],
      active: true,
      role: "ADMIN",
    },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    return { success: false, error: "Usuário não encontrado ou sem permissão de admin." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { success: false, error: "Senha incorreta." };
  }

  await setSession(user.id);
  return { success: true };
}

/** Login de usuário da loja — qualquer SiteUser ativo */
export async function siteLogin(
  formData: FormData
): Promise<{ success: boolean; error?: string; warning?: string }> {
  if (!DEMO_MODE) {
    return { success: false, error: "Use o login Clerk em produção." };
  }

  const username = ((formData.get("username") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";

  if (!username || !password) {
    return { success: false, error: "Preencha usuário e senha." };
  }

  const user = await prisma.siteUser.findFirst({
    where: {
      OR: [{ username }, { email: username }],
      active: true,
    },
    select: { id: true, passwordHash: true, emailVerified: true },
  });

  if (!user) {
    return { success: false, error: "Usuário não encontrado." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { success: false, error: "Senha incorreta." };
  }

  await setSession(user.id);

  if (!user.emailVerified) {
    return { success: true, warning: "E-mail ainda não confirmado. Verifique sua caixa de entrada." };
  }

  return { success: true };
}

/** Logout — remove cookie de sessão */
export async function siteLogout(): Promise<void> {
  await clearSession();
}
