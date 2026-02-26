"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import type { CartWithItems } from "@/types";

interface CheckoutFormProps {
  cart: CartWithItems;
}

/**
 * Formulário de checkout — placeholder para integração Stripe.
 * TODO: integrar @stripe/react-stripe-js com PaymentElement
 */
export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: chamar a API route que cria a Stripe Session
      // const res = await fetch("/api/checkout", { method: "POST" });
      // const { url } = await res.json();
      // router.push(url);

      // Por enquanto apenas simula o redirecionamento
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/account/orders");
    } catch (err) {
      console.error("Erro no checkout:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumo */}
      <div className="rounded-lg border p-4 space-y-2">
        <h3 className="font-semibold">Resumo do pedido</h3>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.product.name} × {item.quantity}
            </span>
            <span>
              {formatPrice(Number(item.product.price) * item.quantity)}
            </span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Dados de envio (placeholder) */}
      <div className="space-y-3">
        <h3 className="font-semibold">Dados de entrega</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Nome" required />
          <Input placeholder="Sobrenome" required />
        </div>
        <Input placeholder="E-mail" type="email" required />
        <Input placeholder="CEP" required />
        <Input placeholder="Endereço" required />
        <div className="grid grid-cols-3 gap-3">
          <Input placeholder="Número" required />
          <Input placeholder="Complemento" className="col-span-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Cidade" required />
          <Input placeholder="Estado (UF)" maxLength={2} required />
        </div>
      </div>

      {/* Placeholder Stripe — substituir por <PaymentElement /> */}
      <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
        <Lock className="h-5 w-5 mx-auto mb-2" />
        <p>Área de pagamento Stripe</p>
        <p className="text-xs mt-1">
          Integre @stripe/react-stripe-js aqui com o PaymentElement
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Lock className="h-4 w-4 mr-2" />
        )}
        {isLoading ? "Processando..." : `Pagar ${formatPrice(total)}`}
      </Button>
    </form>
  );
}
