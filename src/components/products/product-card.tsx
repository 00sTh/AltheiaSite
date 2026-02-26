import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] ?? "/placeholder.svg";
  const inStock = product.stock > 0;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {/* Imagem */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <div className="relative aspect-square bg-muted">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.featured && (
              <Badge className="text-[10px]">Destaque</Badge>
            )}
            {!inStock && (
              <Badge variant="secondary" className="text-[10px]">
                Esgotado
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Infos */}
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
        <span className="font-bold text-primary">
          {formatPrice(Number(product.price))}
        </span>
        {inStock && (
          <span className="text-xs text-muted-foreground">
            {product.stock} em estoque
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
