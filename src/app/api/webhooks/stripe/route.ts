import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * Webhook do Stripe — processa eventos de pagamento
 *
 * Configuração necessária:
 * 1. No painel Stripe > Developers > Webhooks, adicione o endpoint:
 *    https://seu-dominio.com/api/webhooks/stripe
 * 2. Selecione os eventos: checkout.session.completed, payment_intent.succeeded
 * 3. Copie o Signing Secret para STRIPE_WEBHOOK_SECRET no .env
 *
 * Teste local: stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Sem assinatura" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("⚠️ Webhook signature inválida:", err);
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  // ── Processar eventos ───────────────────────────────────────────────
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.warn("❌ Pagamento falhou:", intent.id);
        // TODO: notificar cliente por e-mail
        break;
      }

      default:
        // Ignora eventos não tratados
        break;
    }
  } catch (err) {
    console.error("Erro ao processar webhook:", err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn("⚠️ Webhook sem orderId nos metadata");
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      stripeSessionId: session.id,
      stripePaymentId: session.payment_intent as string,
    },
  });

  console.log(`✅ Pedido ${orderId} marcado como PAID`);

  // Decrementar estoque dos produtos
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (order?.items.length) {
    await prisma.$transaction(
      order.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );
  }

  // TODO: enviar e-mail de confirmação ao cliente
}
