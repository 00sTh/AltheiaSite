import Link from "next/link";
import { ShoppingCart, Sparkles } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

/** Conta quantos itens estão no carrinho do usuário logado */
async function CartCount() {
  const { userId } = await auth();
  if (!userId) return null;

  const cart = await prisma.cart.findUnique({
    where: { clerkId: userId },
    include: { items: true },
  });

  const count = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  if (count === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export async function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>{APP_NAME}</span>
        </Link>

        {/* Navegação central */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Produtos
          </Link>
          <Link
            href="/products?featured=true"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Destaques
          </Link>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Carrinho */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="Carrinho">
              <ShoppingCart className="h-5 w-5" />
              <CartCount />
            </Link>
          </Button>

          {/* Auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Cadastrar</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: "h-8 w-8" },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
