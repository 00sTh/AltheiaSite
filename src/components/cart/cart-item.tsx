"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateQuantity, removeFromCart } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct } from "@/types";

interface CartItemCardProps {
  item: CartItemWithProduct;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const mainImage = item.product.images[0] ?? "/placeholder.svg";

  function handleUpdate(newQty: number) {
    startTransition(() =>
      updateQuantity({ cartItemId: item.id, quantity: newQty })
    );
  }

  function handleRemove() {
    startTransition(() => removeFromCart({ cartItemId: item.id }));
  }

  return (
    <div
      className={`flex gap-4 py-4 border-b last:border-0 transition-opacity ${
        isPending ? "opacity-50" : ""
      }`}
    >
      {/* Imagem */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={mainImage}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Detalhes */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-medium text-sm leading-tight">{item.product.name}</p>
        <p className="text-primary font-semibold">
          {formatPrice(Number(item.product.price))}
        </p>

        {/* Quantidade */}
        <div className="flex items-center gap-2 mt-auto">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleUpdate(item.quantity - 1)}
            disabled={isPending}
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="w-6 text-center text-sm font-medium">
            {item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleUpdate(item.quantity + 1)}
            disabled={isPending || item.quantity >= item.product.stock}
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 ml-2 text-destructive hover:text-destructive"
            onClick={handleRemove}
            disabled={isPending}
            aria-label="Remover item"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Subtotal */}
      <p className="font-semibold text-sm shrink-0">
        {formatPrice(Number(item.product.price) * item.quantity)}
      </p>
    </div>
  );
}
