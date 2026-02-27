/**
 * src/lib/mailer.ts — Envio de emails
 *
 * Sem SMTP configurado: loga no console (útil em desenvolvimento).
 * Em produção: envia via SMTP (configure SMTP_* nas variáveis de ambiente).
 *
 * Variáveis necessárias em produção:
 *   SMTP_HOST="smtp.gmail.com"
 *   SMTP_PORT="587"
 *   SMTP_USER="seu@email.com"
 *   SMTP_PASS="sua-senha-ou-app-password"
 *   SMTP_FROM="Altheia <noreply@altheia.com>"
 */

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Sem SMTP configurado — logar no console (útil em desenvolvimento)
    console.log("\n📧 ═══════════════════════════════════════════");
    console.log(`   Para: ${opts.to}`);
    console.log(`   Assunto: ${opts.subject}`);
    console.log(`   ---`);
    // Extrair texto do HTML para exibição no console
    const text = opts.html
      .replace(/<a[^>]*href="([^"]+)"[^>]*>.*?<\/a>/gi, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    console.log(`   ${text}`);
    console.log("═══════════════════════════════════════════════\n");
    return;
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  const from =
    process.env.SMTP_FROM ?? `Altheia <${user}>`;

  await transporter.sendMail({ from, ...opts });
}

// ─── Notificação de novo pedido para o dono do site ──────────────────────────

interface OrderSummary {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  price: number | string;
  paymentMethod: string;
  itemCount: number;
}

export async function sendNewOrderNotification(
  order: OrderSummary,
  adminEmail: string
): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const adminUrl = `${siteUrl}/admin/orders/${order.id}`;
  const methodLabel: Record<string, string> = {
    PIX: "PIX",
    CREDIT_CARD: "Cartão de Crédito",
    WHATSAPP: "WhatsApp",
  };

  await sendMail({
    to: adminEmail,
    subject: `[Althéia] Novo pedido #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A3D2F;color:#F5F0E6;border-radius:12px">
        <h1 style="color:#C9A227;font-size:1.5rem;margin-bottom:8px">Novo Pedido Recebido</h1>
        <p style="color:#C8BBA8;margin-bottom:20px">Um novo pedido foi criado na Althéia.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:6px 0;color:#C8BBA8">Pedido:</td><td style="padding:6px 0;font-weight:600">#${order.id.slice(0, 8).toUpperCase()}</td></tr>
          <tr><td style="padding:6px 0;color:#C8BBA8">Cliente:</td><td style="padding:6px 0">${order.customerName ?? "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#C8BBA8">Email:</td><td style="padding:6px 0">${order.customerEmail ?? "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#C8BBA8">Total:</td><td style="padding:6px 0;color:#C9A227;font-weight:700">R$ ${Number(order.price).toFixed(2)}</td></tr>
          <tr><td style="padding:6px 0;color:#C8BBA8">Pagamento:</td><td style="padding:6px 0">${methodLabel[order.paymentMethod] ?? order.paymentMethod}</td></tr>
          <tr><td style="padding:6px 0;color:#C8BBA8">Itens:</td><td style="padding:6px 0">${order.itemCount}</td></tr>
        </table>
        <a href="${adminUrl}" style="display:inline-block;background:#C9A227;color:#0A3D2F;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Ver pedido no painel</a>
      </div>
    `,
  });
}

// ─── Confirmação de pedido para o cliente ─────────────────────────────────────

export async function sendOrderConfirmationToCustomer(
  order: OrderSummary
): Promise<void> {
  if (!order.customerEmail) return;

  const methodLabel: Record<string, string> = {
    PIX: "PIX",
    CREDIT_CARD: "Cartão de Crédito",
    WHATSAPP: "WhatsApp",
  };

  await sendMail({
    to: order.customerEmail,
    subject: `Pedido #${order.id.slice(0, 8).toUpperCase()} recebido — Althéia`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A3D2F;color:#F5F0E6;border-radius:12px">
        <h1 style="color:#C9A227;font-size:1.5rem;margin-bottom:8px">Obrigada pela sua compra!</h1>
        <p style="color:#C8BBA8;margin-bottom:20px">Olá${order.customerName ? `, ${order.customerName}` : ""}! Recebemos seu pedido e estamos processando.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:6px 0;color:#C8BBA8">Número do pedido:</td><td style="padding:6px 0;font-weight:600">#${order.id.slice(0, 8).toUpperCase()}</td></tr>
          <tr><td style="padding:6px 0;color:#C8BBA8">Total:</td><td style="padding:6px 0;color:#C9A227;font-weight:700">R$ ${Number(order.price).toFixed(2)}</td></tr>
          <tr><td style="padding:6px 0;color:#C8BBA8">Forma de pagamento:</td><td style="padding:6px 0">${methodLabel[order.paymentMethod] ?? order.paymentMethod}</td></tr>
        </table>
        <p style="color:#C8BBA8;font-size:0.875rem">Você receberá atualizações sobre o status do seu pedido por email. Em caso de dúvidas, entre em contato conosco.</p>
        <p style="margin-top:24px;color:rgba(200,187,168,0.5);font-size:0.75rem">Althéia — A Verdade da Beleza</p>
      </div>
    `,
  });
}
