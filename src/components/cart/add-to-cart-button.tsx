"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/actions/cart";

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
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    startTransition(async () => {
      try {
        await addToCart({ productId, quantity: 1 });
        setAdded(true);
        // Reseta o estado "adicionado" após 2s
        setTimeout(() => setAdded(false), 2000);
      } catch (err) {
        console.error("Erro ao adicionar ao carrinho:", err);
      }
    });
  }

  const isDisabled = disabled || isPending;

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={className}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : added ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {isPending ? "Adicionando..." : added ? "Adicionado!" : "Adicionar ao carrinho"}
    </Button>
  );
}
