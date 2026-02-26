"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { addToCart } from "@/actions/cart";
import { addToGuestCart } from "@/hooks/use-guest-cart";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    startTransition(async () => {
      try {
        if (isSignedIn) {
          await addToCart({ productId, quantity: 1 });
        } else {
          addToGuestCart(productId, 1);
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (err) {
        console.error("Erro ao adicionar ao carrinho:", err);
      }
    });
  }

  const isDisabled = disabled || isPending || !isLoaded;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={cn(
        "flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={
        added
          ? {
              backgroundColor: "#4ade80",
              color: "#0A3D2F",
              boxShadow: "0 0 20px rgba(74,222,128,0.3)",
            }
          : isDisabled && !isPending
          ? {
              backgroundColor: "rgba(201,162,39,0.3)",
              color: "rgba(245,240,230,0.5)",
            }
          : {
              backgroundColor: "#C9A227",
              color: "#0A3D2F",
            }
      }
      onMouseEnter={(e) => {
        if (!isDisabled && !added) {
          (e.currentTarget as HTMLElement).style.backgroundColor = "#E8C84A";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,162,39,0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && !added) {
          (e.currentTarget as HTMLElement).style.backgroundColor = "#C9A227";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }
      }}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : added ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {isPending ? "Adicionando..." : added ? "Adicionado!" : "Adicionar ao Carrinho"}
    </button>
  );
}
