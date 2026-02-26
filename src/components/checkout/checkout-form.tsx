"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CreditCard,
  QrCode,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
import type { CartWithItems } from "@/types";

interface CheckoutFormProps {
  cart: CartWithItems;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(15,74,55,0.6)",
  border: "1px solid rgba(201,162,39,0.25)",
  color: "#F5F0E6",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  color: "rgba(200,187,168,0.7)",
  fontSize: "0.72rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: "0.375rem",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function FocusInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { wrapperClass?: string }
) {
  const [focused, setFocused] = useState(false);
  const { wrapperClass, style: externalStyle, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        ...inputStyle,
        ...externalStyle,
        borderColor: focused ? "rgba(201,162,39,0.6)" : "rgba(201,162,39,0.25)",
        boxShadow: focused ? "0 0 10px rgba(201,162,39,0.1)" : "none",
      }}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
    />
  );
}

type PaymentMethod = "CREDIT_CARD" | "PIX" | "WHATSAPP";

// ─── Card formatters ──────────────────────────────────────────────────────────

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("PIX");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    // Inject raw card number (digits only) for server
    if (method === "CREDIT_CARD") {
      formData.set("cardNumber", cardNumber.replace(/\s/g, ""));
      formData.set("cardExpiry", cardExpiry);
    }

    startTransition(async () => {
      const result = await createOrder(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      if (result.type === "paid") {
        router.push(`/checkout/sucesso?orderId=${result.orderId}&paid=1`);
      } else if (result.type === "pix") {
        const params = new URLSearchParams({
          orderId: result.orderId,
          paymentId: result.cieloPaymentId,
          qr: result.pixQrCode,
        });
        router.push(`/checkout/pix?${params.toString()}`);
      } else {
        // whatsapp
        router.push(`/checkout/sucesso?orderId=${result.orderId}`);
      }
    });
  }

  const methodButton = (
    m: PaymentMethod,
    Icon: React.ElementType,
    label: string,
    desc: string
  ) => (
    <button
      type="button"
      onClick={() => setMethod(m)}
      className="flex items-start gap-3 rounded-xl p-4 text-left transition-all w-full"
      style={{
        border: method === m
          ? "2px solid #C9A227"
          : "1px solid rgba(201,162,39,0.2)",
        backgroundColor: method === m
          ? "rgba(201,162,39,0.08)"
          : "rgba(15,74,55,0.4)",
      }}
    >
      <div
        className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: method === m
            ? "rgba(201,162,39,0.15)"
            : "rgba(201,162,39,0.07)",
        }}
      >
        <Icon className="h-4.5 w-4.5" style={{ color: "#C9A227" }} />
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: "#F5F0E6" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(200,187,168,0.6)" }}>{desc}</p>
      </div>
      {method === m && (
        <div
          className="ml-auto h-4 w-4 rounded-full shrink-0 mt-1 flex items-center justify-center"
          style={{ backgroundColor: "#C9A227" }}
        >
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#0A3D2F" }} />
        </div>
      )}
    </button>
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 p-6"
      style={{ backgroundColor: "#0F4A37" }}
    >
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#F87171",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* Order summary */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{
          backgroundColor: "rgba(10,61,47,0.5)",
          border: "1px solid rgba(201,162,39,0.15)",
        }}
      >
        <h3 className="font-serif font-semibold" style={{ color: "#F5F0E6" }}>
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
          className="pt-3 flex justify-between font-bold"
          style={{ borderTop: "1px solid rgba(201,162,39,0.15)" }}
        >
          <span style={{ color: "#F5F0E6" }}>Total</span>
          <span style={{ color: "#C9A227" }}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Personal + Address */}
      <div className="space-y-4">
        <h3 className="label-luxury" style={{ color: "#C9A227" }}>Dados de Contato</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nome completo *" className="sm:col-span-2">
            <FocusInput name="name" placeholder="Ana Silva" required />
          </Field>
          <Field label="E-mail *">
            <FocusInput name="email" type="email" placeholder="ana@email.com" required />
          </Field>
          <Field label="WhatsApp / Telefone">
            <FocusInput name="phone" type="tel" placeholder="(11) 99999-9999" />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="label-luxury" style={{ color: "#C9A227" }}>Endereço de Entrega</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="CEP *" className="sm:col-span-2">
            <FocusInput name="zip" placeholder="01310-100" required maxLength={9} />
          </Field>
          <Field label="Rua / Avenida *" className="sm:col-span-2">
            <FocusInput name="street" placeholder="Rua das Flores" required />
          </Field>
          <Field label="Número *">
            <FocusInput name="number" placeholder="42" required />
          </Field>
          <Field label="Complemento">
            <FocusInput name="complement" placeholder="Apto 3B" />
          </Field>
          <Field label="Cidade *">
            <FocusInput name="city" placeholder="São Paulo" required />
          </Field>
          <Field label="UF *">
            <FocusInput name="state" placeholder="SP" maxLength={2} required />
          </Field>
          <Field label="Observações" className="sm:col-span-2">
            <textarea
              name="notes"
              placeholder="Ponto de referência, instruções de entrega..."
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>
        </div>
      </div>

      {/* Payment method */}
      <input type="hidden" name="paymentMethod" value={method} />
      <div className="space-y-3">
        <h3 className="label-luxury" style={{ color: "#C9A227" }}>Forma de Pagamento</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {methodButton("PIX", QrCode, "PIX", "Desconto e aprovação imediata")}
          {methodButton("CREDIT_CARD", CreditCard, "Cartão de Crédito", "Até 12× sem juros")}
          {methodButton("WHATSAPP", MessageCircle, "WhatsApp", "Combinar com atendimento")}
        </div>
      </div>

      {/* Credit card fields */}
      {method === "CREDIT_CARD" && (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: "rgba(10,61,47,0.5)",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <h3 className="label-luxury" style={{ color: "#C9A227" }}>Dados do Cartão</h3>

          <Field label="Número do cartão *">
            <FocusInput
              name="cardNumberDisplay"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              required={method === "CREDIT_CARD"}
              maxLength={19}
            />
          </Field>

          <Field label="Nome no cartão *">
            <FocusInput
              name="cardHolder"
              placeholder="ANA SILVA"
              style={{ textTransform: "uppercase" }}
              required={method === "CREDIT_CARD"}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Validade *">
              <FocusInput
                name="cardExpiryDisplay"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                placeholder="MM/AAAA"
                inputMode="numeric"
                required={method === "CREDIT_CARD"}
                maxLength={7}
              />
            </Field>
            <Field label="CVV *">
              <FocusInput
                name="cardCvv"
                placeholder="123"
                inputMode="numeric"
                maxLength={4}
                required={method === "CREDIT_CARD"}
              />
            </Field>
          </div>

          <Field label="Parcelas">
            <div className="relative">
              <select
                name="installments"
                defaultValue="1"
                style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n === 1
                      ? `1× de ${formatPrice(total)} (à vista)`
                      : `${n}× de ${formatPrice(total / n)}`}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{ color: "rgba(201,162,39,0.7)" }}
              />
            </div>
          </Field>

          <p className="text-xs" style={{ color: "rgba(200,187,168,0.5)" }}>
            🔒 Seus dados de cartão são enviados diretamente para a Cielo via conexão segura
            (TLS 1.3) e nunca são armazenados em nossos servidores.
          </p>
        </div>
      )}

      {/* PIX info */}
      {method === "PIX" && (
        <div
          className="rounded-2xl p-5 flex items-start gap-3"
          style={{
            backgroundColor: "rgba(10,61,47,0.5)",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <QrCode className="h-8 w-8 shrink-0" style={{ color: "#C9A227" }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: "#F5F0E6" }}>
              Pagamento instantâneo via PIX
            </p>
            <p className="text-xs" style={{ color: "rgba(200,187,168,0.65)" }}>
              Após confirmar, você receberá um QR Code PIX. O pagamento é processado em
              segundos e o pedido é confirmado automaticamente.
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp info */}
      {method === "WHATSAPP" && (
        <div
          className="rounded-2xl p-5 flex items-start gap-3"
          style={{
            backgroundColor: "rgba(10,61,47,0.5)",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <MessageCircle className="h-8 w-8 shrink-0" style={{ color: "#25D366" }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: "#F5F0E6" }}>
              Finalizar via WhatsApp
            </p>
            <p className="text-xs" style={{ color: "rgba(200,187,168,0.65)" }}>
              Seu pedido será registrado e você será redirecionado para o WhatsApp para combinar
              o pagamento (PIX/transferência/boleto) com nossa equipe.
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all disabled:opacity-60 hover:shadow-[0_0_25px_rgba(201,162,39,0.4)]"
        style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending
          ? "Processando..."
          : method === "CREDIT_CARD"
          ? `Pagar ${formatPrice(total)}`
          : method === "PIX"
          ? `Gerar QR PIX · ${formatPrice(total)}`
          : `Confirmar pedido · ${formatPrice(total)}`}
      </button>
    </form>
  );
}
