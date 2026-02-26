"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartWithItems } from "@/types";

interface CheckoutFormProps {
  cart: CartWithItems;
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(15,74,55,0.6)",
  border: "1px solid rgba(201,162,39,0.25)",
  color: "#F5F0E6",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function LuxuryInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused
          ? "rgba(201,162,39,0.6)"
          : "rgba(201,162,39,0.25)",
        boxShadow: focused
          ? "0 0 12px rgba(201,162,39,0.15)"
          : "none",
      }}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
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
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/account/orders");
    } catch (err) {
      console.error("Erro no checkout:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6"
      style={{ backgroundColor: "#0F4A37" }}
    >
      {/* Order summary */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{
          backgroundColor: "rgba(10,61,47,0.5)",
          border: "1px solid rgba(201,162,39,0.15)",
        }}
      >
        <h3
          className="font-serif font-semibold text-base"
          style={{ color: "#F5F0E6" }}
        >
          Resumo do Pedido
        </h3>
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm"
            style={{ color: "#C8BBA8" }}
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span style={{ color: "#F5F0E6" }}>
              {formatPrice(Number(item.product.price) * item.quantity)}
            </span>
          </div>
        ))}
        <div
          className="pt-3 flex justify-between font-bold text-base"
          style={{
            borderTop: "1px solid rgba(201,162,39,0.15)",
          }}
        >
          <span style={{ color: "#F5F0E6" }}>Total</span>
          <span style={{ color: "#C9A227" }}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Shipping fields */}
      <div className="space-y-3">
        <h3
          className="label-luxury"
          style={{ color: "#C9A227" }}
        >
          Dados de Entrega
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <LuxuryInput placeholder="Nome" required />
          <LuxuryInput placeholder="Sobrenome" required />
        </div>
        <LuxuryInput placeholder="E-mail" type="email" required />
        <LuxuryInput placeholder="CEP" required />
        <LuxuryInput placeholder="Endereço" required />
        <div className="grid grid-cols-3 gap-3">
          <LuxuryInput placeholder="Número" required />
          <input
            placeholder="Complemento"
            style={inputStyle}
            className="col-span-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <LuxuryInput placeholder="Cidade" required />
          <LuxuryInput placeholder="UF" maxLength={2} required />
        </div>
      </div>

      {/* Stripe placeholder */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          border: "1px dashed rgba(201,162,39,0.3)",
          backgroundColor: "rgba(10,61,47,0.3)",
        }}
      >
        <Lock className="h-5 w-5 mx-auto mb-2" style={{ color: "rgba(201,162,39,0.5)" }} />
        <p className="text-sm font-medium" style={{ color: "#C8BBA8" }}>
          Área de Pagamento Seguro
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(200,187,168,0.5)" }}>
          Integre @stripe/react-stripe-js aqui com o PaymentElement
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all disabled:opacity-60 hover:bg-[#E8C84A] hover:shadow-[0_0_25px_rgba(201,162,39,0.4)]"
        style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        {isLoading ? "Processando..." : `Pagar ${formatPrice(total)}`}
      </button>
    </form>
  );
}
