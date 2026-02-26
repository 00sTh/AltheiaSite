"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

const checkoutSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20).optional().or(z.literal("")),
  street: z.string().min(2).max(200),
  number: z.string().min(1).max(20),
  complement: z.string().max(100).optional().or(z.literal("")),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(2),
  zip: z.string().min(8).max(9),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export async function createOrder(formData: FormData): Promise<
  { success: false; error: string } | { success: true; orderId: string }
> {
  const { userId } = await getServerAuth();
  if (!userId) redirect("/sign-in");

  const raw = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const d = parsed.data;

  // Get cart with items
  const cart = await prisma.cart.findUnique({
    where: { clerkId: userId },
    include: { items: { include: { product: { select: { id: true, price: true, stock: true, name: true } } } } },
  });

  if (!cart || cart.items.length === 0) {
    return { success: false, error: "Carrinho vazio" };
  }

  // Validate stock for all items
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return {
        success: false,
        error: `Estoque insuficiente para "${item.product.name}"`,
      };
    }
  }

  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  // Find or create UserProfile
  const userProfile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!userProfile) {
    return { success: false, error: "Perfil de usuário não encontrado. Faça login novamente." };
  }

  const shippingAddress = JSON.stringify({
    street: d.street,
    number: d.number,
    complement: d.complement || null,
    city: d.city,
    state: d.state,
    zip: d.zip,
  });

  // Create order + decrement stock in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        status: "PENDING",
        price: total,
        customerName: d.name,
        customerEmail: d.email,
        customerPhone: d.phone || null,
        shippingAddress,
        notes: d.notes || null,
        userProfileId: userProfile.id,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.product.price),
          })),
        },
      },
    });

    // Decrement stock for each product
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear the cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  revalidatePath("/cart");
  revalidatePath("/", "layout");

  return { success: true, orderId: order.id };
}

/** Get a single order by ID (for the user who created it) */
export async function getOrder(orderId: string) {
  const { userId } = await getServerAuth();
  if (!userId) return null;

  const userProfile = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!userProfile) return null;

  return prisma.order.findUnique({
    where: { id: orderId, userProfileId: userProfile.id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
  });
}
