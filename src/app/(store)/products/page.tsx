import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { Button } from "@/components/ui/button";
import { getProducts, getCategories } from "@/actions/products";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Explore nossa linha completa de cosméticos premium.",
};

// Revalida a listagem a cada 30 minutos
export const revalidate = 1800;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    search?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");

  const [{ products, total, pages }, categories] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      page,
      search: params.search,
      featured: params.featured === "true" ? true : undefined,
    }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.category
            ? categories.find((c) => c.slug === params.category)?.name ?? "Produtos"
            : params.featured === "true"
            ? "Destaques"
            : "Todos os produtos"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {total} produto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        {/* Filtros */}
        <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-xl" />}>
          <ProductFilters categories={categories} />
        </Suspense>

        {/* Grid de produtos */}
        <div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">
                Nenhum produto encontrado para estes filtros.
              </p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/products">Limpar filtros</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Paginação simples */}
              {pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pages }).map((_, i) => {
                    const p = i + 1;
                    const href = new URL(
                      `/products?${new URLSearchParams({
                        ...params,
                        page: String(p),
                      })}`,
                      "http://x"
                    ).search.slice(1);
                    return (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        asChild
                      >
                        <Link href={`/products?${href}`}>{p}</Link>
                      </Button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
