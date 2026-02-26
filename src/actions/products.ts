"use server";

import { prisma } from "@/lib/prisma";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { ProductWithCategory } from "@/types";

/** Parâmetros de filtro para listagem de produtos */
interface GetProductsParams {
  categorySlug?: string;
  page?: number;
  featured?: boolean;
  search?: string;
}

/** Retorna produtos com paginação e filtros opcionais */
export async function getProducts(params: GetProductsParams = {}): Promise<{
  products: ProductWithCategory[];
  total: number;
  pages: number;
}> {
  const { categorySlug, page = 1, featured, search } = params;

  const where = {
    active: true,
    ...(featured !== undefined && { featured }),
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            ...((process.env.DATABASE_URL ?? "").startsWith("postgres") && {
              mode: "insensitive" as const,
            }),
          },
        },
        {
          description: {
            contains: search,
            ...((process.env.DATABASE_URL ?? "").startsWith("postgres") && {
              mode: "insensitive" as const,
            }),
          },
        },
      ],
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: PRODUCTS_PER_PAGE,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products as ProductWithCategory[],
    total,
    pages: Math.ceil(total / PRODUCTS_PER_PAGE),
  };
}

/** Busca um produto pelo slug */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: { category: true },
  });
  return product as ProductWithCategory | null;
}

/** Retorna todas as categorias */
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}
