"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth";
import { addToCart } from "@/actions/cart";

const GUEST_CART_KEY = "altheia:guest-cart";

export interface GuestCartItem {
  productId: string;
  quantity: number;
}

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

export function setGuestCart(items: GuestCartItem[]): void {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

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

export function clearGuestCart(): void {
  localStorage.removeItem(GUEST_CART_KEY);
}

/** Hook: sincroniza carrinho guest → banco ao fazer login */
export function useGuestCartSync(): void {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    async function syncToDatabase() {
      for (const item of guestItems) {
        try {
          await addToCart({ productId: item.productId, quantity: item.quantity });
        } catch (err) {
          console.warn(`[guest-cart] falha ao migrar produto ${item.productId}:`, err);
        }
      }
      clearGuestCart();
    }

    void syncToDatabase();
  }, [isSignedIn, isLoaded]);
}
