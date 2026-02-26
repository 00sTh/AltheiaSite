"use client";

import Link from "next/link";
import { ShoppingCart, User, Heart, Menu } from "lucide-react";
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
      <div className="relative container mx-auto flex h-16 items-center px-4 max-w-7xl">
        {/* Left — nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors duration-200 relative group pb-0.5"
              style={{ color: "#C8BBA8" }}
            >
              <span className="group-hover:text-[#C9A227] transition-colors duration-200">
                {label}
              </span>
              <span
                className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: "#C9A227" }}
              />
            </Link>
          ))}
        </nav>

        {/* Center — logo (absolute) */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif font-bold text-xl tracking-widest uppercase transition-colors duration-200 hover:text-[#C9A227]"
          style={{ color: "#F5F0E6" }}
        >
          {APP_NAME}
        </Link>

        {/* Right — icons */}
        <div className="ml-auto flex items-center gap-1">
          {userId && (
            <Link
              href="/wishlist"
              aria-label="Lista de Desejos"
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:text-[#C9A227]"
              style={{ color: "#C8BBA8" }}
            >
              <Heart className="h-5 w-5" />
            </Link>
          )}

          <Link
            href="/cart"
            aria-label="Carrinho"
            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:text-[#C9A227]"
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

          <Link
            href={userId ? "/account" : "/sign-in"}
            aria-label="Conta"
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:text-[#C9A227]"
            style={{ color: "#C8BBA8" }}
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Mobile hamburger */}
          <MobileNav userId={userId} cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}
