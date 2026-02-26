"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { addToCart } from "@/actions/cart";

const GUEST_CART_KEY = "altheia:guest-cart";

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

/** Lê o carrinho guest do localStorage */
export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

/** Salva o carrinho guest no localStorage */
export function setGuestCart(items: GuestCartItem[]): void {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

/** Adiciona (ou incrementa) um item no carrinho guest */
export function addToGuestCart(productId: string, quantity = 1): void {
  const items = getGuestCart();
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, quantity });
  }
  setGuestCart(items);
}

/** Remove o carrinho guest do localStorage */
export function clearGuestCart(): void {
  localStorage.removeItem(GUEST_CART_KEY);
}

/**
 * Hook que sincroniza o carrinho guest (localStorage) com o banco
 * quando o usuário faz login.
 *
 * Uso: inserir em um Client Component no layout da loja.
 *
 * @example
 * // src/components/layout/guest-cart-sync.tsx
 * "use client";
 * import { useGuestCartSync } from "@/hooks/use-guest-cart";
 * export function GuestCartSync() {
 *   useGuestCartSync();
 *   return null;
 * }
 */
export function useGuestCartSync(): void {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    // Aguarda o Clerk carregar o estado de autenticação
    if (!isLoaded) return;
    // Só sincroniza quando acabou de logar
    if (!isSignedIn) return;

    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    // Migra cada item do localStorage para o banco
    async function syncToDatabase() {
      for (const item of guestItems) {
        try {
          await addToCart({ productId: item.productId, quantity: item.quantity });
        } catch (err) {
          // Ignora erros individuais (ex: produto esgotado)
          console.warn(`[guest-cart] falha ao migrar produto ${item.productId}:`, err);
        }
      }
      // Limpa o carrinho guest após migração bem-sucedida
      clearGuestCart();
      console.log(`[guest-cart] ${guestItems.length} item(s) migrado(s) para o banco`);
    }

    void syncToDatabase();
  }, [isSignedIn, isLoaded]);
}
