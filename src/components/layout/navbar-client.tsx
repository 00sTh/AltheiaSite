"use client";

import Link from "next/link";
import { ShoppingCart, Sparkles, User, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileNav } from "./mobile-nav";
import { APP_NAME } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/products", label: "Loja" },
  { href: "/sobre-nos", label: "Sobre Nós" },
  { href: "/videos", label: "Vídeos" },
];

interface NavbarClientProps {
  userId: string | null;
  cartCount: number;
}

export function NavbarClient({ userId, cartCount }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(10,61,47,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(201,162,39,0.2)"
          : "1px solid transparent",
      }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(201,162,39,0.4)]"
            style={{
              backgroundColor: "rgba(201,162,39,0.12)",
              border: "1px solid rgba(201,162,39,0.4)",
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: "#C9A227" }} />
          </div>
          <span
            className="font-serif font-bold text-xl tracking-wide"
            style={{ color: "#F5F0E6" }}
          >
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors duration-200 relative group"
              style={{ color: "#C8BBA8" }}
            >
              <span className="group-hover:text-[#C9A227] transition-colors duration-200">
                {label}
              </span>
              <span
                className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #C9A227, transparent)",
                }}
              />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          {userId && (
            <Link
              href="/wishlist"
              aria-label="Lista de Desejos"
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-[rgba(201,162,39,0.1)]"
              style={{ color: "#C8BBA8" }}
            >
              <Heart className="h-5 w-5" />
            </Link>
          )}
          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Carrinho"
            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-[rgba(201,162,39,0.1)]"
            style={{ color: "#C8BBA8" }}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth (desktop) */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {userId ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:text-[#C9A227]"
                style={{
                  color: "#C8BBA8",
                  border: "1px solid rgba(201,162,39,0.2)",
                }}
              >
                <User className="h-4 w-4" />
                Conta
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 hover:text-[#C9A227]"
                  style={{ color: "#C8BBA8" }}
                >
                  Entrar
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-200 hover:bg-[#E8C84A] hover:shadow-[0_0_15px_rgba(201,162,39,0.4)]"
                  style={{
                    backgroundColor: "#C9A227",
                    color: "#0A3D2F",
                    fontSize: "0.7rem",
                  }}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <MobileNav userId={userId} cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}
