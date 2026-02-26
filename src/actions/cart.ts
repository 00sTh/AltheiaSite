"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  addToCartSchema,
  updateQuantitySchema,
  removeFromCartSchema,
} from "@/schemas/cart.schema";
import type { CartWithItems } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers internos
// ─────────────────────────────────────────────────────────────────────────────

/** Busca ou cria o carrinho do usuário autenticado */
async function getOrCreateCart(clerkId: string) {
  let cart = await prisma.cart.findUnique({
    where: { clerkId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    // Tenta vincular ao perfil caso já exista
    const profile = await prisma.userProfile.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    cart = await prisma.cart.create({
      data: { clerkId, userProfileId: profile?.id },
      include: { items: { include: { product: true } } },
    });
  }

  return cart as CartWithItems;
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions públicas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna o carrinho do usuário autenticado.
 * Retorna null se não estiver logado.
 */
export async function getCart(): Promise<CartWithItems | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return getOrCreateCart(userId);
}

/**
 * Adiciona um produto ao carrinho.
 * Se já existir, incrementa a quantidade.
 */
export async function addToCart(
  data: z.infer<typeof addToCartSchema>
): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const { productId, quantity } = addToCartSchema.parse(data);

  // Verifica estoque antes de adicionar
  const product = await prisma.product.findUnique({
    where: { id: productId, active: true },
    select: { stock: true, name: true },
  });
  if (!product) throw new Error("Produto não encontrado");
  if (product.stock < quantity)
    throw new Error(`Estoque insuficiente para "${product.name}"`);

  const cart = await getOrCreateCart(userId);

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
    select: { id: true, quantity: true },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock)
      throw new Error(`Estoque insuficiente para "${product.name}"`);

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

/**
 * Atualiza a quantidade de um item.
 * Quantity = 0 remove o item.
 */
export async function updateQuantity(
  data: z.infer<typeof updateQuantitySchema>
): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const { cartItemId, quantity } = updateQuantitySchema.parse(data);

  if (quantity === 0) {
    await removeFromCart({ cartItemId });
    return;
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  revalidatePath("/cart");
}

/** Remove um item específico do carrinho */
export async function removeFromCart(
  data: z.infer<typeof removeFromCartSchema>
): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const { cartItemId } = removeFromCartSchema.parse(data);

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

/**
 * Limpa todo o carrinho.
 * Chamada internamente após checkout bem-sucedido.
 */
export async function clearCart(): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const cart = await prisma.cart.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
