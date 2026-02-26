/**
 * GET /api/check-payment?paymentId=...&orderId=...
 *
 * Endpoint de polling para a página PIX verificar se o pagamento foi confirmado.
 * Consultamos a Cielo e, se confirmado, atualizamos o pedido no banco.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentStatus, isPaymentConfirmed, isPaymentDenied } from "@/lib/cielo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");

  if (!paymentId || !orderId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // Check current order status in DB first (avoid unnecessary Cielo calls)
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, cieloPaymentId: true, items: { select: { productId: true, quantity: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ paid: true, denied: false });
  }
  if (order.status === "CANCELLED") {
    return NextResponse.json({ paid: false, denied: true });
  }

  // Query Cielo for current status
  const payment = await getPaymentStatus(paymentId);
  if (!payment) {
    return NextResponse.json({ paid: false, denied: false });
  }

  if (isPaymentConfirmed(payment.Status)) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });
    return NextResponse.json({ paid: true, denied: false });
  }

  if (isPaymentDenied(payment.Status)) {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });
    return NextResponse.json({ paid: false, denied: true });
  }

  return NextResponse.json({ paid: false, denied: false });
}
