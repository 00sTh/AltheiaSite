"use client";

import { useGuestCartSync } from "@/hooks/use-guest-cart";

/**
 * Componente invisível que sincroniza o carrinho guest (localStorage)
 * com o banco quando o usuário faz login.
 *
 * Inserido no layout da loja — não renderiza nada visualmente.
 */
export function GuestCartSync() {
  useGuestCartSync();
  return null;
}
