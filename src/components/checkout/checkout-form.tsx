"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
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
        borderColor: focused ? "rgba(201,162,39,0.6)" : "rgba(201,162,39,0.25)",
        boxShadow: focused ? "0 0 12px rgba(201,162,39,0.15)" : "none",
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
    />
  );
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createOrder(formData);
      if (!result.success) {
        setError(result.error);
      } else {
        router.push(`/checkout/sucesso?orderId=${result.orderId}`);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6"
      style={{ backgroundColor: "#0F4A37" }}
    >
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {error}
        </div>
      )}

      {/* Order summary */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ backgroundColor: "rgba(10,61,47,0.5)", border: "1px solid rgba(201,162,39,0.15)" }}
      >
        <h3 className="font-serif font-semibold text-base" style={{ color: "#F5F0E6" }}>
          Resumo do Pedido
        </h3>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm" style={{ color: "#C8BBA8" }}>
            <span>{item.product.name} × {item.quantity}</span>
            <span style={{ color: "#F5F0E6" }}>
              {formatPrice(Number(item.product.price) * item.quantity)}
            </span>
          </div>
        ))}
        <div
          className="pt-3 flex justify-between font-bold text-base"
          style={{ borderTop: "1px solid rgba(201,162,39,0.15)" }}
        >
          <span style={{ color: "#F5F0E6" }}>Total</span>
          <span style={{ color: "#C9A227" }}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Personal info */}
      <div className="space-y-3">
        <h3 className="label-luxury" style={{ color: "#C9A227" }}>Dados Pessoais</h3>
        <LuxuryInput name="name" placeholder="Nome completo" required />
        <LuxuryInput name="email" type="email" placeholder="E-mail" required />
        <LuxuryInput name="phone" type="tel" placeholder="WhatsApp / Telefone" />
      </div>

      {/* Shipping address */}
      <div className="space-y-3">
        <h3 className="label-luxury" style={{ color: "#C9A227" }}>Endereço de Entrega</h3>
        <LuxuryInput name="zip" placeholder="CEP (ex: 01310-100)" required maxLength={9} />
        <LuxuryInput name="street" placeholder="Rua / Avenida" required />
        <div className="grid grid-cols-3 gap-3">
          <LuxuryInput name="number" placeholder="Nº" required />
          <input
            name="complement"
            placeholder="Complemento"
            style={{ ...inputStyle, gridColumn: "span 2" }}
            className="col-span-2"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <LuxuryInput name="city" placeholder="Cidade" required className="col-span-2" style={{ gridColumn: "span 2" }} />
          <LuxuryInput name="state" placeholder="UF" maxLength={2} required />
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="label-luxury mb-2" style={{ color: "#C9A227" }}>Observações</h3>
        <textarea
          name="notes"
          placeholder="Instruções de entrega, ponto de referência..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)" }}
      >
        <Package className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#C9A227" }} />
        <p className="text-sm" style={{ color: "#C8BBA8" }}>
          Seu pedido será criado com status <strong style={{ color: "#F5F0E6" }}>PENDENTE</strong>. Após confirmar,
          você receberá um link do WhatsApp para combinar o pagamento e a entrega com nossa equipe.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all disabled:opacity-60 hover:bg-[#E8C84A] hover:shadow-[0_0_25px_rgba(201,162,39,0.4)]"
        style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        {isPending ? "Criando pedido..." : `Confirmar Pedido · ${formatPrice(total)}`}
      </button>
    </form>
  );
}
