import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GuestCartSync } from "@/components/layout/guest-cart-sync";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";
import { prisma } from "@/lib/prisma";

/** Layout compartilhado pela loja (todas as páginas públicas) */
export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
    select: { whatsappNumber: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sincroniza carrinho guest → banco quando usuário faz login */}
      <GuestCartSync />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab whatsappNumber={settings?.whatsappNumber ?? "5511999999999"} />
    </div>
  );
}
