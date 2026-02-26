import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "@/components/cart/cart-item";
import { getCart } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Carrinho",
};

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center gap-4">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold">Carrinho vazio</h1>
        <p className="text-muted-foreground">
          Você ainda não adicionou nenhum produto.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Explorar produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Carrinho ({itemCount} {itemCount === 1 ? "item" : "itens"})
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lista de itens */}
        <div>
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Resumo do pedido */}
        <div className="h-fit rounded-xl border p-6 space-y-4 sticky top-20">
          <h2 className="font-semibold text-lg">Resumo</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({itemCount} itens)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Frete</span>
              <span className={subtotal >= 199 ? "text-green-600 font-medium" : ""}>
                {subtotal >= 199 ? "Grátis" : "A calcular"}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(subtotal)}</span>
          </div>

          <Button size="lg" className="w-full" asChild>
            <Link href="/checkout">
              Finalizar compra <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/products">Continuar comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
