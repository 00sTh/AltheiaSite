import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Admin — Novo Produto" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: "rgba(200,187,168,0.5)" }}>
          <Link href="/admin/products" className="hover:text-[#C9A227] transition-colors">
            Produtos
          </Link>
          <span>/</span>
          <span style={{ color: "#C9A227" }}>Novo produto</span>
        </div>
        <h1 className="font-serif text-3xl font-bold" style={{ color: "#F5F0E6" }}>
          Novo Produto
        </h1>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: "#0A2419", border: "1px solid rgba(201,162,39,0.15)" }}
      >
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
