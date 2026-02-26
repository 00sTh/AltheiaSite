import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { getProducts, getCategories } from "@/actions/products";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

// Revalida a home a cada 1 hora
export const revalidate = 3600;

async function FeaturedProducts() {
  const { products } = await getProducts({ featured: true });

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        Nenhum produto em destaque no momento.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/products?category=${cat.slug}`}
          className="group rounded-xl border bg-card p-6 text-center hover:border-primary hover:shadow-md transition-all"
        >
          <p className="font-semibold group-hover:text-primary transition-colors">
            {cat.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {cat._count.products} produtos
          </p>
        </Link>
      ))}
    </div>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl bg-muted h-72" />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Star className="h-3 w-3 fill-primary" />
            Nova coleção 2026
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Beleza que{" "}
            <span className="text-primary">transforma</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            {APP_DESCRIPTION} Descubra nossa curadoria de produtos selecionados
            para todos os tipos de pele.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/products">
                Ver coleção <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products?featured=true">Destaques</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Categorias ───────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Explorar por categoria
        </h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-muted h-20" />
              ))}
            </div>
          }
        >
          <CategoryGrid />
        </Suspense>
      </section>

      {/* ── Produtos em destaque ─────────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Em Destaque</h2>
          <Button variant="ghost" asChild>
            <Link href="/products">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Suspense fallback={<ProductsLoadingSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </>
  );
}
