/**
 * Webhook da Cielo — recebe notificações de mudança de status de pagamento.
 *
 * Configurar no painel Cielo:
 *   Configurações > Notificações > URL de Notificação: https://seudominio.com/api/webhooks/cielo
 *   Método: POST · Formato: JSON
 *
 * A Cielo envia o PaymentId; consultamos a API para obter o status atual.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentStatus, isPaymentConfirmed, isPaymentDenied } from "@/lib/cielo";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { PaymentId } =
    (body as { Data?: { PaymentId?: string }; PaymentId?: string })?.Data ??
    (body as { PaymentId?: string });

  if (!PaymentId) {
    return NextResponse.json({ error: "Missing PaymentId" }, { status: 400 });
  }

  // Find the order associated with this Cielo payment
  const order = await prisma.order.findFirst({
    where: { cieloPaymentId: PaymentId },
    select: { id: true, status: true, items: { select: { productId: true, quantity: true } } },
  });

  if (!order) {
    // Could be a payment we don't recognize yet — return 200 to avoid retries
    return NextResponse.json({ ok: true });
  }

  // Query Cielo for current payment status
  const payment = await getPaymentStatus(PaymentId);
  if (!payment) {
    return NextResponse.json({ error: "Could not fetch payment" }, { status: 502 });
  }

  if (isPaymentConfirmed(payment.Status) && order.status !== "PAID") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });
  } else if (isPaymentDenied(payment.Status) && order.status === "PENDING") {
    // Payment denied — cancel and restore stock
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });
  }

  return NextResponse.json({ ok: true });
}
