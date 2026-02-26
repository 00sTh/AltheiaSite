import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  const base = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

  /**
   * Extensão que auto-parseia o campo `images` (String JSON → string[]).
   * Necessário porque SQLite não suporta arrays nativos.
   * Em produção com PostgreSQL, pode ser removida.
   */
  return base.$extends({
    result: {
      product: {
        imagesArray: {
          needs: { images: true },
          compute(product) {
            try {
              const parsed = JSON.parse(product.images);
              return Array.isArray(parsed) ? (parsed as string[]) : [];
            } catch {
              return [] as string[];
            }
          },
        },
      },
    },
  });
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientSingleton;
};

/** Singleton do Prisma — evita múltiplas instâncias em dev com hot-reload */
export const prisma: PrismaClientSingleton =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** Converte array de imagens para JSON string (para salvar no banco) */
export function stringifyImages(images: string[]): string {
  return JSON.stringify(images);
}

/** Parseia o campo images do banco → string[] */
export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
