"use client";

/**
 * src/context/auth.tsx — Contexto de autenticação client-side
 *
 * Em DEMO_MODE: fornece um usuário fixo via Context (sem Clerk).
 * Em produção: usa useUser() do Clerk via contexto.
 *
 * Usar useAuth() em vez de useUser() do Clerk em Client Components.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface AuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  userFirstName: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  userFirstName: null,
});

export const useAuth = () => useContext(AuthContext);

/** Provedor para DEMO_MODE — reflete sessão real do servidor */
export function DemoAuthProvider({
  children,
  initialAuth,
}: {
  children: ReactNode;
  initialAuth: { isSignedIn: boolean; userId: string | null; userFirstName: string | null };
}) {
  return (
    <AuthContext.Provider
      value={{
        isLoaded: true,
        isSignedIn: initialAuth.isSignedIn,
        userId: initialAuth.userId,
        userFirstName: initialAuth.userFirstName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Provedor para produção — bridge entre Clerk e o contexto interno.
 * Usar quando DEMO_MODE=false.
 */
export function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <AuthContext.Provider
      value={{
        isLoaded,
        isSignedIn: isSignedIn ?? false,
        userId: user?.id ?? null,
        userFirstName: user?.firstName ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
