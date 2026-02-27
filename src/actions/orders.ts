"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { getServerAuth, getServerUser } from "@/lib/auth";
import { sendNewOrderNotification, sendOrderConfirmationToCustomer } from "@/lib/mailer";
import {
  createCreditCardPayment,
  createPixPayment,
  detectCardBrand,
  isPaymentConfirmed,
  isPaymentDenied,
  type CieloCreditCard,
} from "@/lib/cielo";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const addressSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20).optional().or(z.literal("")),
  street: z.string().min(2).max(200),
  number: z.string().min(1).max(20),
  complement: z.string().max(100).optional().or(z.literal("")),
  city: z.string().min(2).max(100),
  state: z.string().length(2),
  zip: z.string().min(8).max(9),
  notes: z.string().max(500).optional().or(z.literal("")),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOrCreateUserProfile(userId: string) {
  const existing = await prisma.userProfile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (existing) return existing;

  // Profile not found — create from Clerk (or demo) data
  const user = await getServerUser();
  type ClerkUser = { emailAddresses?: Array<{ emailAddress: string }> };
  const email =
    (user as ClerkUser)?.emailAddresses?.[0]?.emailAddress ??
    `${userId}@altheia.com`;

  return prisma.userProfile.create({
    data: { clerkId: userId, email },
    select: { id: true },
  });
}

async function getCartWithItems(userId: string) {
  return prisma.cart.findUnique({
    where: { clerkId: userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, price: true, stock: true, name: true },
          },
        },
      },
    },
  });
}

// ─── createOrder ──────────────────────────────────────────────────────────────

/** Cria o pedido no banco + processa pagamento via Cielo ou fluxo WhatsApp */
export async function createOrder(
  formData: FormData
): Promise<
  | { success: false; error: string }
  | { success: true; type: "paid"; orderId: string }
  | { success: true; type: "pix"; orderId: string; cieloPaymentId: string; pixQrCode: string }
  | { success: true; type: "whatsapp"; orderId: string }
> {
  const { userId } = await getServerAuth();
  if (!userId) redirect("/sign-in");

  // Validate address fields
  const raw = Object.fromEntries(formData.entries());
  const parsed = addressSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const paymentMethod = (formData.get("paymentMethod") as string) || "WHATSAPP";

  // Get cart
  const cart = await getCartWithItems(userId);
  if (!cart || cart.items.length === 0) {
    return { success: false, error: "Carrinho vazio" };
  }

  // Validate stock
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return {
        success: false,
        error: `Estoque insuficiente para "${item.product.name}"`,
      };
    }
  }

  // Get or create user profile (creates on first order in demo mode)
  const userProfile = await getOrCreateUserProfile(userId);

  const total = cart.items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const shippingAddress = JSON.stringify({
    street: d.street,
    number: d.number,
    complement: d.complement || null,
    city: d.city,
    state: d.state,
    zip: d.zip,
  });

  // ── Create order + decrement stock in a transaction ──────────────────────
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        status: "PENDING",
        price: total,
        paymentMethod: paymentMethod as PaymentMethod,
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

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  revalidatePath("/cart");
  revalidatePath("/", "layout");

  // ── Enviar notificações por email (não bloqueia o fluxo se falhar) ────────
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { notificationEmail: true },
    });
    const orderSummary = {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      price: total,
      paymentMethod,
      itemCount: cart.items.length,
    };
    const emailPromises: Promise<void>[] = [
      sendOrderConfirmationToCustomer(orderSummary),
    ];
    if (settings?.notificationEmail) {
      emailPromises.push(sendNewOrderNotification(orderSummary, settings.notificationEmail));
    }
    await Promise.allSettled(emailPromises);
  } catch {
    // Falha no email não deve bloquear o pedido
  }

  // ── WhatsApp flow (sem pagamento online) ─────────────────────────────────
  if (paymentMethod === "WHATSAPP") {
    return { success: true, type: "whatsapp", orderId: order.id };
  }

  // ── Cielo — Cartão de Crédito ─────────────────────────────────────────────
  if (paymentMethod === "CREDIT_CARD") {
    const cardNumber = (formData.get("cardNumber") as string) ?? "";
    const cardHolder = (formData.get("cardHolder") as string) ?? "";
    const cardExpiry = (formData.get("cardExpiry") as string) ?? "";
    const cardCvv = (formData.get("cardCvv") as string) ?? "";
    const installments = parseInt((formData.get("installments") as string) || "1", 10);

    const card: CieloCreditCard = {
      CardNumber: cardNumber,
      Holder: cardHolder,
      ExpirationDate: cardExpiry, // "MM/YYYY"
      SecurityCode: cardCvv,
      Brand: detectCardBrand(cardNumber),
    };

    let cieloResp;
    try {
      cieloResp = await createCreditCardPayment({
        merchantOrderId: order.id,
        customer: { Name: d.name, Email: d.email },
        amountInReais: total,
        installments,
        card,
      });
    } catch (err) {
      // Payment call failed — mark order cancelled
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      // Restore stock
      for (const item of cart.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      console.error("Cielo error:", err);
      return { success: false, error: "Erro ao conectar com o gateway de pagamento. Tente novamente." };
    }

    const { Payment } = cieloResp;

    if (isPaymentConfirmed(Payment.Status)) {
      // Payment approved — update order
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", cieloPaymentId: Payment.PaymentId },
      });
      return { success: true, type: "paid", orderId: order.id };
    }

    if (isPaymentDenied(Payment.Status)) {
      // Denied — cancel order and restore stock
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", cieloPaymentId: Payment.PaymentId },
      });
      for (const item of cart.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      const msg = Payment.ReturnMessage ?? "Pagamento recusado";
      return { success: false, error: `Cartão recusado: ${msg}. Verifique os dados ou tente outro cartão.` };
    }

    // Other status (e.g. 0 = NotFinished)
    await prisma.order.update({
      where: { id: order.id },
      data: { cieloPaymentId: Payment.PaymentId },
    });
    return { success: true, type: "paid", orderId: order.id };
  }

  // ── Cielo — PIX ───────────────────────────────────────────────────────────
  if (paymentMethod === "PIX") {
    let pixResp;
    try {
      pixResp = await createPixPayment({
        merchantOrderId: order.id,
        customer: { Name: d.name, Email: d.email },
        amountInReais: total,
      });
    } catch (err) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      console.error("Cielo PIX error:", err);
      return { success: false, error: "Erro ao gerar PIX. Tente novamente." };
    }

    const { Payment } = pixResp;
    const pixQrCode = Payment.QrCodeString ?? "";

    await prisma.order.update({
      where: { id: order.id },
      data: {
        cieloPaymentId: Payment.PaymentId,
        pixQrCode,
      },
    });

    return {
      success: true,
      type: "pix",
      orderId: order.id,
      cieloPaymentId: Payment.PaymentId,
      pixQrCode,
    };
  }

  // Fallback
  return { success: true, type: "whatsapp", orderId: order.id };
}

// ─── getOrder ─────────────────────────────────────────────────────────────────

/** Busca um pedido pelo ID (do usuário autenticado) */
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
        include: {
          product: { select: { name: true, images: true, slug: true } },
        },
      },
    },
  });
}
