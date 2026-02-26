import { createHmac } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "site_session";
const SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-in-production";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function sign(userId: string, ts: string): string {
  return createHmac("sha256", SECRET)
    .update(`${userId}.${ts}`)
    .digest("hex");
}

/** Cria e define o cookie de sessão (httpOnly, sameSite=lax). */
export async function setSession(userId: string): Promise<void> {
  const jar = await cookies();
  const ts = Date.now().toString();
  const sig = sign(userId, ts);
  jar.set(COOKIE, `${userId}.${ts}.${sig}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Lê e verifica o cookie de sessão.
 * Retorna o userId se válido e não expirado, null caso contrário.
 */
export async function getSession(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return null;

  // Formato: {userId}.{timestamp}.{sig}
  // userId é UUID (sem ponto), então basta split por "."
  const parts = value.split(".");
  if (parts.length < 3) return null;

  const sig = parts[parts.length - 1];
  const ts = parts[parts.length - 2];
  const userId = parts.slice(0, parts.length - 2).join(".");

  const expectedSig = sign(userId, ts);
  if (sig !== expectedSig) return null;

  const age = Date.now() - parseInt(ts, 10);
  if (isNaN(age) || age > MAX_AGE * 1000) return null;

  return userId;
}

/** Remove o cookie de sessão. */
export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
