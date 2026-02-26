import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { DemoAuthProvider } from "@/context/auth";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: APP_NAME,
  },
};

const isDemoMode = process.env.DEMO_MODE === "true";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let demoAuth: { isSignedIn: boolean; userId: string | null; userFirstName: string | null } = {
    isSignedIn: false,
    userId: null,
    userFirstName: null,
  };

  if (isDemoMode) {
    const { getSession } = await import("@/lib/session");
    const { prisma } = await import("@/lib/prisma");
    const userId = await getSession();
    if (userId) {
      const user = await prisma.siteUser.findUnique({
        where: { id: userId, active: true },
        select: { id: true, username: true },
      });
      if (user) {
        demoAuth = { isSignedIn: true, userId: user.id, userFirstName: user.username };
      }
    }
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        {isDemoMode ? (
          <DemoAuthProvider initialAuth={demoAuth}>{children}</DemoAuthProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
