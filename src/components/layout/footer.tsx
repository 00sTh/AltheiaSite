import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Marca */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Cosméticos premium para realçar sua beleza natural.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Loja</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Todos os produtos
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-foreground transition-colors">
                  Destaques
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground transition-colors">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Conta */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Conta</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/account" className="hover:text-foreground transition-colors">
                  Minha conta
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-foreground transition-colors">
                  Meus pedidos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
