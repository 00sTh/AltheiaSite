"use client";

/**
 * src/context/auth.tsx — Contexto de autenticação client-side via Clerk
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

/** Bridge entre Clerk e o contexto interno */
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
