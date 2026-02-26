"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/products", label: "Loja" },
  { href: "/sobre-nos", label: "Sobre Nós" },
  { href: "/videos", label: "Vídeos" },
];

interface MobileNavProps {
  userId: string | null;
  cartCount: number;
}

export function MobileNav({ userId, cartCount }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors"
        style={{ color: "#C9A227" }}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col"
              style={{
                backgroundColor: "#0A3D2F",
                borderLeft: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-6"
                style={{
                  borderBottom: "1px solid rgba(201,162,39,0.15)",
                }}
              >
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" style={{ color: "#C9A227" }} />
                  <span
                    className="font-serif font-bold text-lg"
                    style={{ color: "#F5F0E6" }}
                  >
                    {APP_NAME}
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ color: "#C8BBA8" }}
                  aria-label="Fechar menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6">
                <ul className="space-y-1">
                  {navLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{ color: "#C8BBA8" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "#C9A227";
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(201,162,39,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "#C8BBA8";
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer actions */}
              <div
                className="p-6 space-y-3"
                style={{ borderTop: "1px solid rgba(201,162,39,0.15)" }}
              >
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    backgroundColor: "rgba(201,162,39,0.08)",
                    border: "1px solid rgba(201,162,39,0.2)",
                    color: "#F5F0E6",
                  }}
                >
                  <ShoppingCart className="h-4 w-4" style={{ color: "#C9A227" }} />
                  <span>Carrinho</span>
                  {cartCount > 0 && (
                    <span
                      className="ml-auto text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {userId ? (
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                    style={{ color: "#C8BBA8" }}
                  >
                    <User className="h-4 w-4" style={{ color: "#C9A227" }} />
                    <span>Minha Conta</span>
                  </Link>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-semibold tracking-widest uppercase w-full transition-all"
                    style={{
                      backgroundColor: "#C9A227",
                      color: "#0A3D2F",
                    }}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
