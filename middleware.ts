/**
 * middleware.ts
 *
 * DEMO_MODE=true  → passthrough (sem verificação de auth)
 * DEMO_MODE=false → Clerk middleware com proteção de rotas
 */
import { NextResponse, type NextRequest } from "next/server";

const DEMO_MODE = process.env.DEMO_MODE === "true";

// Rotas que não precisam de autenticação
const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/products",
  "/sobre-nos",
  "/videos",
  "/politica-de-privacidade",
  "/termos-de-uso",
  "/loja",
  "/api/newsletter",
  "/api/webhooks",
  "/api/check-payment",
  "/robots.txt",
  "/sitemap.xml",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?")
  );
}

async function clerkMiddleware(req: NextRequest) {
  const { clerkMiddleware: clerk, createRouteMatcher } =
    await import("@clerk/nextjs/server");

  const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/products(.*)",
    "/sobre-nos(.*)",
    "/videos(.*)",
    "/politica-de-privacidade(.*)",
    "/termos-de-uso(.*)",
    "/loja(.*)",
    "/api/newsletter(.*)",
    "/api/webhooks(.*)",
    "/api/check-payment(.*)",
  ]);

  const handler = clerk(async (auth, request) => {
    const { userId, sessionClaims } = await auth();
    const pathname = request.nextUrl.pathname;

    // Admin routes: require admin role
    if (pathname.startsWith("/admin")) {
      if (!userId) {
        return NextResponse.redirect(new URL("/sign-in?redirect_url=/admin", request.url));
      }
      const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Protected routes: require login
    if (!isPublicRoute(request) && !userId) {
      return NextResponse.redirect(
        new URL(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    return NextResponse.next();
  });

  return handler(req, {} as never);
}

export default async function middleware(req: NextRequest) {
  if (DEMO_MODE) {
    return NextResponse.next();
  }
  return clerkMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
