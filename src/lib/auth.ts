/**
 * src/lib/auth.ts — Camada de autenticação via Clerk
 */

export type ServerAuthResult = {
  userId: string | null;
  sessionClaims: { metadata?: { role?: string } } | null;
  redirectToSignIn: (opts?: { returnBackUrl?: string }) => never;
};

/** Retorna userId + sessionClaims */
export async function getServerAuth(): Promise<ServerAuthResult> {
  const { auth } = await import("@clerk/nextjs/server");
  const result = await auth();
  return {
    userId: result.userId,
    sessionClaims: result.sessionClaims as { metadata?: { role?: string } } | null,
    redirectToSignIn: result.redirectToSignIn as (opts?: { returnBackUrl?: string }) => never,
  };
}

/** Retorna dados do usuário atual */
export async function getServerUser() {
  const { currentUser } = await import("@clerk/nextjs/server");
  return currentUser();
}
