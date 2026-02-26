import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não está definida");
}

/** Instância singleton do Stripe SDK */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/** Formata centavos para valor legível — ex: 4990 → "R$ 49,90" */
export function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

/** Converte Decimal/number para centavos para o Stripe */
export function toCents(price: number | string): number {
  return Math.round(Number(price) * 100);
}
