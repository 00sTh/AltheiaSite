"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/actions/cart";
import { addToGuestCart } from "@/hooks/use-guest-cart";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Botão "Adicionar ao carrinho" — suporta usuários autenticados e guests.
 *
 * - Autenticado: persiste no banco via Server Action
 * - Guest: salva no localStorage (sincronizado ao banco no próximo login)
 */
export function AddToCartButton({
  productId,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    startTransition(async () => {
      try {
        if (isSignedIn) {
          // Usuário autenticado — persiste no banco
          await addToCart({ productId, quantity: 1 });
        } else {
          // Guest — salva no localStorage para sincronizar ao logar
          addToGuestCart(productId, 1);
        }

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (err) {
        console.error("Erro ao adicionar ao carrinho:", err);
      }
    });
  }

  // Aguarda Clerk carregar antes de permitir a ação
  const isDisabled = disabled || isPending || !isLoaded;

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
      {isPending
        ? "Adicionando..."
        : added
        ? "Adicionado!"
        : "Adicionar ao carrinho"}
    </Button>
  );
}
