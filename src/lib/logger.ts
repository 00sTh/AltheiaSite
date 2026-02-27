/**
 * Logger estruturado — server-side only.
 * Em produção, também persiste no banco de dados (tabela error_logs).
 */
import { prisma } from "@/lib/prisma";

interface LogErrorOpts {
  message: string;
  digest?: string;
  stack?: string;
  path?: string;
}

export async function logError(opts: LogErrorOpts): Promise<void> {
  // Sempre loga no console (aparece nos Vercel Function Logs)
  console.error(
    JSON.stringify({
      level: "error",
      ts: new Date().toISOString(),
      ...opts,
    })
  );

  // Em produção, persiste no banco
  if (process.env.NODE_ENV === "production") {
    try {
      await prisma.errorLog.create({
        data: {
          message: opts.message.slice(0, 2000),
          digest: opts.digest ?? null,
          stack: opts.stack ? opts.stack.slice(0, 5000) : null,
          path: opts.path ?? null,
        },
      });
    } catch {
      // Falha no log não deve propagar
    }
  }
}
