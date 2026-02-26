import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { CartItemCard } from "@/components/cart/cart-item";
import { getCart } from "@/actions/cart";
import { getSiteSettings } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Carrinho",
};

export default async function CartPage() {
  const [cart, settings] = await Promise.all([getCart(), getSiteSettings()]);
  const items = cart?.items ?? [];
  const threshold = Number(settings.shippingFreeThreshold);

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShipping = subtotal >= threshold;

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center gap-6 px-4 py-20"
        style={{ backgroundColor: "#0A3D2F" }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "rgba(201,162,39,0.08)",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <ShoppingCart className="h-10 w-10" style={{ color: "rgba(201,162,39,0.4)" }} />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: "#F5F0E6" }}>
            Carrinho vazio
          </h1>
          <p className="text-base" style={{ color: "#C8BBA8" }}>
            Você ainda não adicionou nenhum produto.
          </p>
        </div>
        <Link
          href="/products"
          className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase transition-all hover:bg-[#E8C84A] hover:shadow-[0_0_20px_rgba(201,162,39,0.4)]"
          style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
        >
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "#0A3D2F" }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="label-luxury mb-2" style={{ color: "#C9A227" }}>
            Meu Carrinho
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: "#F5F0E6" }}>
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "#0F4A37",
                  border: "1px solid rgba(201,162,39,0.15)",
                }}
              >
                <CartItemCard item={item} />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="h-fit rounded-2xl p-6 space-y-5 sticky top-24"
            style={{
              backgroundColor: "#0F4A37",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <h2
              className="font-serif text-xl font-bold"
              style={{ color: "#F5F0E6" }}
            >
              Resumo do Pedido
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between" style={{ color: "#C8BBA8" }}>
                <span>Subtotal ({itemCount} itens)</span>
                <span style={{ color: "#F5F0E6" }}>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: "#C8BBA8" }}>
                <span>Frete</span>
                <span
                  className="font-medium"
                  style={{ color: freeShipping ? "#4ade80" : "#C8BBA8" }}
                >
                  {freeShipping ? "Grátis" : "A calcular"}
                </span>
              </div>
              {!freeShipping && (
                <p className="text-xs" style={{ color: "rgba(200,187,168,0.6)" }}>
                  Adicione mais {formatPrice(threshold - subtotal)} para frete grátis
                </p>
              )}
            </div>

            <div
              className="pt-4 flex justify-between font-bold text-xl"
              style={{
                borderTop: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              <span style={{ color: "#F5F0E6" }}>Total</span>
              <span style={{ color: "#C9A227" }}>{formatPrice(subtotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm font-semibold tracking-widest uppercase transition-all hover:bg-[#E8C84A] hover:shadow-[0_0_20px_rgba(201,162,39,0.4)]"
              style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
            >
              Finalizar compra <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center w-full py-3 rounded-full text-sm font-medium"
              style={{
                border: "1px solid rgba(201,162,39,0.3)",
                color: "#C9A227",
              }}
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
