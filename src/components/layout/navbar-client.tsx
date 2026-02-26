"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Heart, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileNav } from "./mobile-nav";
import { LogoutButton } from "./logout-button";
import { APP_NAME } from "@/lib/constants";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/products", label: "Loja" },
  { href: "/sobre-nos", label: "Sobre Nós" },
  { href: "/videos", label: "Vídeos" },
];

interface NavbarClientProps {
  userId: string | null;
  isAdmin: boolean;
  cartCount: number;
  siteLogoUrl: string | null;
}

export function NavbarClient({ userId, isAdmin, cartCount, siteLogoUrl }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-500"
      style={{
        backgroundColor: scrolled
          ? "rgba(10,61,47,0.97)"
          : "rgba(10,61,47,0.18)",
        backdropFilter: "blur(14px)",
        borderBottom: scrolled
          ? "1px solid rgba(201,162,39,0.25)"
          : "1px solid rgba(201,162,39,0.08)",
        boxShadow: "0 4px 30px rgba(201,162,39,0.12)",
      }}
    >
      <div className="relative container mx-auto flex h-20 items-center px-6 max-w-7xl">

        {/* Esquerda — links de navegação (desktop) */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-base font-semibold tracking-wider uppercase transition-colors duration-200 group pb-0.5"
              style={{ color: "#C8BBA8", fontSize: "0.72rem", letterSpacing: "0.14em" }}
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

        {/* Centro — logo absoluto */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 select-none"
          aria-label="Ir para início"
        >
          {siteLogoUrl ? (
            <Image
              src={siteLogoUrl}
              alt={APP_NAME}
              width={140}
              height={42}
              className="object-contain h-10 w-auto"
              priority
            />
          ) : (
            <span
              className="font-serif font-bold tracking-[0.22em] uppercase transition-colors duration-300 hover:text-[#C9A227]"
              style={{
                color: "#F5F0E6",
                fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                textShadow: "0 0 30px rgba(201,162,39,0.15)",
              }}
            >
              {APP_NAME}
            </span>
          )}
        </Link>

        {/* Direita — ícones de ação */}
        <div className="ml-auto flex items-center gap-1">
          {/* Wishlist (só logado) */}
          {userId && (
            <Link
              href="/wishlist"
              aria-label="Lista de Desejos"
              className="group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200"
              style={{ color: "#C8BBA8" }}
            >
              <Heart
                className="h-5 w-5 transition-all duration-200 group-hover:text-[#C9A227] group-hover:drop-shadow-[0_0_8px_rgba(201,162,39,0.6)]"
              />
            </Link>
          )}

          {/* Carrinho */}
          <Link
            href="/cart"
            aria-label="Carrinho"
            className="group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200"
            style={{ color: "#C8BBA8" }}
          >
            <ShoppingCart
              className="h-5 w-5 transition-all duration-200 group-hover:text-[#C9A227] group-hover:drop-shadow-[0_0_8px_rgba(201,162,39,0.6)]"
            />
            {cartCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Painel Admin (só para admins, desktop) */}
          {isAdmin && (
            <Link
              href="/admin"
              aria-label="Painel Admin"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:shadow-[0_0_14px_rgba(201,162,39,0.35)]"
              style={{
                border: "1px solid rgba(201,162,39,0.5)",
                color: "#C9A227",
              }}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          {/* Conta (desktop) */}
          <Link
            href={userId ? "/account" : "/sign-in"}
            aria-label="Conta"
            className="group hidden md:flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200"
            style={{ color: "#C8BBA8" }}
          >
            <User
              className="h-5 w-5 transition-all duration-200 group-hover:text-[#C9A227] group-hover:drop-shadow-[0_0_8px_rgba(201,162,39,0.6)]"
            />
          </Link>

          {/* Logout (DEMO_MODE, usuário logado) */}
          {DEMO_MODE && userId && <LogoutButton />}

          {/* Hamburger mobile */}
          <MobileNav userId={userId} isAdmin={isAdmin} cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}
