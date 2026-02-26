import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GuestCartSync } from "@/components/layout/guest-cart-sync";

/** Layout compartilhado pela loja (todas as páginas públicas) */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Sincroniza carrinho guest → banco quando usuário faz login */}
      <GuestCartSync />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
