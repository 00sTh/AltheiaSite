"use client";

import { useGuestCartSync } from "@/hooks/use-guest-cart";

export function GuestCartSync() {
  useGuestCartSync();
  return null;
}
