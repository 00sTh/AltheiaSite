import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getProductBySlug, getProducts } from "@/actions/products";
import { formatPrice, truncate } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Gera paths estáticos para os produtos em destaque no build */
export async function generateStaticParams() {
  const { products } = await getProducts({ featured: true });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: truncate(product.description, 160),
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const inStock = product.stock > 0;
  const mainImage = product.images[0] ?? "/placeholder.svg";

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Galeria de imagens */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {/* Thumbnails adicionais */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações do produto */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <p className="text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">
              {product.category.name}
            </span>
          </p>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(Number(product.price))}
              </span>
              {product.featured && (
                <Badge>Destaque</Badge>
              )}
              {!inStock && (
                <Badge variant="destructive">Esgotado</Badge>
              )}
            </div>
          </div>

          {/* Descrição */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Estoque */}
          {inStock && (
            <p className="text-sm text-muted-foreground">
              {product.stock} unidade{product.stock !== 1 ? "s" : ""} disponíve{product.stock !== 1 ? "is" : "l"}
            </p>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              productId={product.id}
              disabled={!inStock}
              className="flex-1"
            />
          </div>

          {/* Benefícios */}
          <div className="rounded-xl border p-4 text-sm space-y-2 text-muted-foreground">
            <p>✓ Frete grátis acima de R$ 199</p>
            <p>✓ Troca e devolução em até 30 dias</p>
            <p>✓ Pagamento seguro via Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
