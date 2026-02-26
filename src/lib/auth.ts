/**
 * src/lib/auth.ts — Camada de autenticação unificada
 *
 * Em DEMO_MODE (sem Clerk): retorna um usuário demo fixo.
 * Em produção: delega para @clerk/nextjs/server.
 *
 * Usar estas funções em vez de importar Clerk diretamente
 * em Server Components e Server Actions.
 */

const DEMO_MODE = process.env.DEMO_MODE === "true";

export const DEMO_USER_ID = "demo-user-clerk-id-00001";

export const DEMO_SESSION = {
  userId: DEMO_USER_ID,
  sessionClaims: {
    metadata: { role: "admin" } as { role?: string },
  },
};

export const DEMO_CURRENT_USER = {
  id: DEMO_USER_ID,
  firstName: "Demo",
  lastName: "Admin",
  emailAddresses: [{ emailAddress: "demo@altheia.com" }],
  imageUrl: "https://api.dicebear.com/9.x/initials/svg?seed=DA",
};

/** Retorna userId + sessionClaims (análogo ao auth() do Clerk) */
export async function getServerAuth(): Promise<{
  userId: string | null;
  sessionClaims: { metadata?: { role?: string } } | null;
  redirectToSignIn: (opts?: { returnBackUrl?: string }) => never;
}> {
  if (DEMO_MODE) {
    return {
      ...DEMO_SESSION,
      redirectToSignIn: () => {
        throw new Error("Demo mode: redirectToSignIn chamado");
      },
    };
  }

  const { auth } = await import("@clerk/nextjs/server");
  const result = await auth();
  return {
    userId: result.userId,
    sessionClaims: result.sessionClaims as { metadata?: { role?: string } } | null,
    redirectToSignIn: result.redirectToSignIn as (opts?: { returnBackUrl?: string }) => never,
  };
}

/** Retorna os dados do usuário atual (análogo ao currentUser() do Clerk) */
export async function getServerUser() {
  if (DEMO_MODE) return DEMO_CURRENT_USER;

  const { currentUser } = await import("@clerk/nextjs/server");
  return currentUser();
}
