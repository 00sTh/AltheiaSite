import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utilitário padrão do shadcn/ui para mesclar classes Tailwind */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata preço em BRL — ex: 49.9 → "R$ 49,90" */
export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(price));
}

/** Trunca texto com reticências — ex: truncate("foo bar baz", 7) → "foo bar…" */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
