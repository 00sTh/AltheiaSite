/**
 * middleware.ts
 *
 * DEMO_MODE=true  → auth próprio via cookie site_session
 * DEMO_MODE=false → Clerk middleware
 */
import { NextResponse, type NextRequest } from "next/server";

const DEMO_MODE = process.env.DEMO_MODE === "true";

// Rotas sempre públicas (sem auth)
const PUBLIC_PREFIXES = [
  "/",
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
  "/_next",
  "/favicon",
];

// Rotas de auth (sem proteção)
const AUTH_PATHS = ["/sign-in", "/sign-up", "/admin/login"];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"))
  );
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function demoMiddleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Sempre permite arquivos estáticos e auth pages
  if (isAuthPath(pathname)) return NextResponse.next();
  if (isPublicPath(pathname)) return NextResponse.next();

  // Verificar presença do cookie (verificação completa é feita em server components)
  const session = req.cookies.get("site_session")?.value;

  if (!session) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.redirect(
      new URL(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  return NextResponse.next();
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

    if (pathname.startsWith("/admin")) {
      if (!userId) {
        return NextResponse.redirect(new URL("/sign-in?redirect_url=/admin", request.url));
      }
      const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

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
    return demoMiddleware(req);
  }
  return clerkMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
