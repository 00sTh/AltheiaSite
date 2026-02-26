"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Category } from "@prisma/client";

interface ProductFiltersProps {
  categories: (Category & { _count: { products: number } })[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");

  /** Atualiza o filtro na URL sem perder outros parâmetros */
  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Volta para página 1 ao filtrar
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <aside className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Categorias
        </h3>
        <ul className="space-y-1">
          <li>
            <Button
              variant={!currentCategory ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setFilter("category", null)}
            >
              Todos os produtos
            </Button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Button
                variant={currentCategory === cat.slug ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setFilter("category", cat.slug)}
              >
                {cat.name}
                <span className="ml-auto text-xs text-muted-foreground">
                  {cat._count.products}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
