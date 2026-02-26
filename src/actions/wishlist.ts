"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";
import { z } from "zod";

const wishlistItemSchema = z.object({
  productId: z.string().uuid(),
});

async function getOrCreateWishlist(clerkId: string) {
  return prisma.wishlist.upsert({
    where: { clerkId },
    create: { clerkId },
    update: {},
  });
}

export async function addToWishlist(productId: string) {
  const { userId } = await getServerAuth();
  if (!userId) return { success: false, error: "Não autenticado" };

  const { productId: pid } = wishlistItemSchema.parse({ productId });
  const wishlist = await getOrCreateWishlist(userId);

  await prisma.wishlistItem.upsert({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId: pid } },
    create: { wishlistId: wishlist.id, productId: pid },
    update: {},
  });

  revalidatePath("/wishlist");
  return { success: true };
}

export async function removeFromWishlist(productId: string) {
  const { userId } = await getServerAuth();
  if (!userId) return { success: false, error: "Não autenticado" };

  const { productId: pid } = wishlistItemSchema.parse({ productId });
  const wishlist = await prisma.wishlist.findUnique({ where: { clerkId: userId } });
  if (!wishlist) return { success: true };

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, productId: pid },
  });

  revalidatePath("/wishlist");
  return { success: true };
}

export async function getWishlist() {
  const { userId } = await getServerAuth();
  if (!userId) return null;

  return prisma.wishlist.findUnique({
    where: { clerkId: userId },
    include: {
      items: {
        include: { product: { include: { category: true } } },
      },
    },
  });
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const { userId } = await getServerAuth();
  if (!userId) return false;

  const item = await prisma.wishlistItem.findFirst({
    where: {
      wishlist: { clerkId: userId },
      productId,
    },
  });
  return !!item;
}
