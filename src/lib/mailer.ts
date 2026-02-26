/**
 * src/lib/mailer.ts — Envio de emails
 *
 * Em DEMO_MODE ou sem SMTP configurado: loga o link no console.
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
