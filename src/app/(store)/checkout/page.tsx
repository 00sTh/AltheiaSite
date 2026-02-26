import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCart } from "@/actions/cart";

export const metadata: Metadata = {
  title: "Finalizar compra",
};

export default async function CheckoutPage() {
  const cart = await getCart();

  // Redireciona se carrinho estiver vazio
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {/* Header segurança */}
      <div className="flex items-center gap-2 mb-8">
        <Lock className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Finalizar compra</h1>
      </div>

      <CheckoutForm cart={cart} />
    </div>
  );
}
