import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";
import { NavbarClient } from "./navbar-client";

async function getNavData() {
  const { userId } = await getServerAuth();
  let cartCount = 0;
  if (userId) {
    const cart = await prisma.cart.findUnique({
      where: { clerkId: userId },
      include: { items: true },
    });
    cartCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const siteLogoUrl = settings?.siteLogoUrl ?? null;

  return { userId, cartCount, siteLogoUrl };
}

export async function Navbar() {
  const { userId, cartCount, siteLogoUrl } = await getNavData();
  return <NavbarClient userId={userId} cartCount={cartCount} siteLogoUrl={siteLogoUrl} />;
}
