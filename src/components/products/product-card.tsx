import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { parseImages } from "@/lib/prisma";
import { ProductImage } from "@/components/ui/product-image";
import { WishlistButton } from "@/components/products/wishlist-button";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const images = parseImages(product.images as unknown as string);
  const mainImage = images[0] ?? "/placeholder.svg";
  const inStock = product.stock > 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 border border-[rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.5)] hover:shadow-[0_0_30px_rgba(201,162,39,0.12)] hover:-translate-y-1 bg-[#0F4A37]">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <div className="relative aspect-square bg-[#145A43]">
          <ProductImage
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
            style={{
              background:
                "linear-gradient(to top, rgba(10,61,47,0.85) 0%, transparent 60%)",
            }}
          >
            <span
              className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full"
              style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
            >
              Ver produto <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Wishlist button */}
          <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <WishlistButton productId={product.id} />
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.featured && (
              <span
                className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
              >
                Destaque
              </span>
            )}
            {!inStock && (
              <span
                className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(224,82,82,0.9)", color: "#F5F0E6" }}
              >
                Esgotado
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p
          className="label-luxury mb-1.5"
          style={{ color: "#C9A227", fontSize: "0.65rem" }}
        >
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3
            className="font-serif font-semibold text-base leading-snug line-clamp-2 mb-3 transition-colors duration-200 group-hover:text-[#C9A227]"
            style={{ color: "#F5F0E6" }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg" style={{ color: "#C9A227" }}>
            {formatPrice(Number(product.price))}
          </span>
          {inStock && (
            <span className="text-xs" style={{ color: "rgba(200,187,168,0.6)" }}>
              {product.stock} em estoque
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
