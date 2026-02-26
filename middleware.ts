import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** Rotas completamente públicas — sem necessidade de autenticação */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/products(.*)",
  "/api/webhooks(.*)",
]);

/** Rotas restritas a administradores */
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // ── Admin: exige autenticação + role "admin" nos metadata do Clerk ──
  if (isAdminRoute(request)) {
    if (!userId) {
      return (await auth()).redirectToSignIn({ returnBackUrl: request.url });
    }
    const role = (sessionClaims?.metadata as { role?: string } | undefined)
      ?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Rotas protegidas gerais (/account, /cart, /checkout, /orders) ──
  if (!isPublicRoute(request) && !userId) {
    return (await auth()).redirectToSignIn({ returnBackUrl: request.url });
  }
});

export const config = {
  matcher: [
    // Ignora arquivos estáticos e internals do Next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
