/**
 * src/lib/email-verify.ts — Geração e envio de tokens de verificação de email
 */
import { randomBytes } from "crypto";
import { prisma } from "./prisma";
import { sendMail } from "./mailer";

/** Gera um token hex de 32 bytes e o salva no SiteUser com validade de 24h */
export async function generateEmailVerifyToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const exp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

  await prisma.siteUser.update({
    where: { id: userId },
    data: {
      emailVerifyToken: token,
      emailVerifyTokenExp: exp,
      emailVerified: false,
    },
  });

  return token;
}

/** Envia email de verificação para o usuário */
export async function sendVerificationEmail(
  userId: string,
  email: string,
  username: string
): Promise<void> {
  const token = await generateEmailVerifyToken(userId);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verificar-email?token=${token}`;

  await sendMail({
    to: email,
    subject: "Confirme seu e-mail — Altheia",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0F4A37;border-radius:16px;color:#F5F0E6;">
        <h1 style="font-size:28px;font-weight:bold;color:#C9A227;margin:0 0 8px;">Altheia</h1>
        <p style="color:rgba(200,187,168,0.6);font-size:12px;margin:0 0 24px;text-transform:uppercase;letter-spacing:0.1em;">Confirmação de E-mail</p>
        <p style="margin:0 0 8px;">Olá, <strong>${username}</strong>!</p>
        <p style="color:rgba(200,187,168,0.8);margin:0 0 24px;">
          Clique no botão abaixo para confirmar o seu endereço de e-mail.
          Este link expira em <strong>24 horas</strong>.
        </p>
        <a href="${verifyUrl}"
           style="display:inline-block;background:#C9A227;color:#0A3D2F;padding:14px 32px;border-radius:12px;font-weight:bold;font-size:14px;text-decoration:none;">
          Confirmar e-mail
        </a>
        <p style="margin:24px 0 0;font-size:12px;color:rgba(200,187,168,0.4);">
          Ou acesse: ${verifyUrl}
        </p>
        <p style="margin:16px 0 0;font-size:12px;color:rgba(200,187,168,0.3);">
          Se você não solicitou este e-mail, ignore esta mensagem.
        </p>
      </div>
    `,
  });
}

/** Verifica o token. Retorna o userId se válido, null se inválido/expirado. */
export async function verifyEmailToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  const user = await prisma.siteUser.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyTokenExp: { gt: new Date() },
    },
    select: { id: true, email: true },
  });

  if (!user) return null;

  // Marcar como verificado e limpar token
  await prisma.siteUser.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifyToken: null,
      emailVerifyTokenExp: null,
    },
  });

  return { userId: user.id, email: user.email };
}
