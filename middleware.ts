import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware de autenticação.
 *
 * DEMO_MODE=true  → passthrough, sem verificação de auth
 * DEMO_MODE=false → substituir pelo conteúdo de middleware.clerk.ts (ver CLAUDE.md)
 */
export default function middleware(_req: NextRequest) {
  // Em produção com Clerk, substituir este arquivo por:
  //
  // import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
  // const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", ...]);
  // export default clerkMiddleware(async (auth, request) => { ... });
  //
  // Veja o exemplo completo em CLAUDE.md

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
