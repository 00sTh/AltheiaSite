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

function getOrCreateClient(): PrismaClientSingleton {
  // Se o cliente cacheado não tiver o modelo SiteUser (schema desatualizado),
  // descarta e recria — evita erros após mudanças no schema sem restart completo.
  if (globalForPrisma.prisma && !("siteUser" in globalForPrisma.prisma)) {
    globalForPrisma.prisma = undefined;
  }
  return globalForPrisma.prisma ?? createPrismaClient();
}

/** Singleton do Prisma — evita múltiplas instâncias em dev com hot-reload */
export const prisma: PrismaClientSingleton = getOrCreateClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
