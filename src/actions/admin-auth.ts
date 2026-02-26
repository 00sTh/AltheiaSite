"use server";

import { cookies } from "next/headers";

const DEMO_MODE = process.env.DEMO_MODE === "true";

// Credenciais do admin demo (apenas válidas em DEMO_MODE)
// Para mudar: atualizar estas constantes ou mover para variável de ambiente
const DEMO_ADMIN_USER = process.env.DEMO_ADMIN_USER ?? "admin";
const DEMO_ADMIN_PASS = process.env.DEMO_ADMIN_PASS ?? "altheia2024";

export async function adminDemoLogin(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  if (!DEMO_MODE) {
    // Em produção, o login é feito pelo Clerk — redirecionar para /sign-in
    return { success: false, error: "Use o login Clerk em produção." };
  }

  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (
    username !== DEMO_ADMIN_USER ||
    password !== DEMO_ADMIN_PASS
  ) {
    return { success: false, error: "Usuário ou senha inválidos." };
  }

  // Em DEMO_MODE o middleware já libera tudo, então apenas setamos um cookie
  // sinaleiro para feedback visual (não é usado para autenticação real)
  const jar = await cookies();
  jar.set("demo_admin_logged", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return { success: true };
}

export async function adminDemoLogout() {
  const jar = await cookies();
  jar.delete("demo_admin_logged");
}
