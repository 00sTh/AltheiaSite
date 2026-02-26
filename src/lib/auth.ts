/**
 * src/lib/auth.ts — Camada de autenticação unificada
 *
 * DEMO_MODE=true  → auth próprio via SiteUser + cookie de sessão
 * DEMO_MODE=false → Clerk
 */

const DEMO_MODE = process.env.DEMO_MODE === "true";

// Mantido para filtrar o usuário demo de listagens legadas
export const DEMO_USER_ID = "demo-user-clerk-id-00001";

export type ServerAuthResult = {
  userId: string | null;
  sessionClaims: { metadata?: { role?: string } } | null;
  redirectToSignIn: (opts?: { returnBackUrl?: string }) => never;
};

/** Retorna userId + sessionClaims (análogo ao auth() do Clerk) */
export async function getServerAuth(): Promise<ServerAuthResult> {
  if (DEMO_MODE) {
    const { getSession } = await import("./session");
    const { prisma } = await import("./prisma");

    const userId = await getSession();
    if (!userId) {
      return {
        userId: null,
        sessionClaims: null,
        redirectToSignIn: () => {
          throw new Error("Não autenticado");
        },
      };
    }

    const user = await prisma.siteUser.findUnique({
      where: { id: userId, active: true },
      select: { id: true, role: true },
    });

    if (!user) {
      return {
        userId: null,
        sessionClaims: null,
        redirectToSignIn: () => {
          throw new Error("Usuário não encontrado");
        },
      };
    }

    return {
      userId: user.id,
      sessionClaims: {
        metadata: { role: user.role === "ADMIN" ? "admin" : undefined },
      },
      redirectToSignIn: () => {
        throw new Error("Demo: redirect to sign-in");
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

/** Retorna dados do usuário atual (análogo ao currentUser() do Clerk) */
export async function getServerUser() {
  if (DEMO_MODE) {
    const { getSession } = await import("./session");
    const { prisma } = await import("./prisma");

    const userId = await getSession();
    if (!userId) return null;

    const user = await prisma.siteUser.findUnique({
      where: { id: userId, active: true },
      select: { id: true, email: true, username: true },
    });
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.username,
      lastName: null,
      emailAddresses: [{ emailAddress: user.email }],
      imageUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.username)}`,
    };
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  return currentUser();
}
