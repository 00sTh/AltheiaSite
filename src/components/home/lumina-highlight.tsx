"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Leaf, Star } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { SectionTitle } from "@/components/ui/section-title";
import { slideInLeft, slideInRight } from "@/lib/animations";

const benefits = [
  { icon: Droplets, label: "Hidratação Profunda", desc: "72h de hidratação comprovada" },
  { icon: Leaf, label: "100% Natural", desc: "Ingredientes de origem vegetal" },
  { icon: Star, label: "Premiado", desc: "Melhor sérum 2025 – Beauty Awards" },
];

export function LuminaHighlight() {
  return (
    <section
      className="py-24 px-4 overflow-hidden"
      style={{ backgroundColor: "#0F4A37" }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInLeft}
            className="relative"
          >
            <div
              className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #0A3D2F 0%, #145A43 50%, #0F4A37 100%)",
                border: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 60% 40%, rgba(201,162,39,0.15) 0%, transparent 60%)",
                }}
              />

              {/* Placeholder product visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-24 h-40 mx-auto rounded-2xl mb-4"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(201,162,39,0.3) 0%, rgba(201,162,39,0.1) 100%)",
                      border: "1px solid rgba(201,162,39,0.4)",
                    }}
                  />
                  <p
                    className="font-serif text-xl italic"
                    style={{ color: "#C9A227" }}
                  >
                    Lumina Sérum
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div
                className="absolute top-6 right-6 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "#C9A227",
                  color: "#0A3D2F",
                }}
              >
                Novo
              </div>
            </div>

            {/* Decorative circle */}
            <div
              className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10"
              style={{
                background: "radial-gradient(circle, #C9A227 0%, transparent 70%)",
              }}
            />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInRight}
            className="space-y-8"
          >
            <SectionTitle
              label="Produto Estrela"
              title="Descubra o Lumina Sérum"
              subtitle="O sérum que redefiniu o padrão de luminosidade na skincare brasileira. Formulado com Vitamina C estabilizada e extrato de algas douradas."
              align="left"
              animate={false}
            />

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(201,162,39,0.1)",
                      border: "1px solid rgba(201,162,39,0.3)",
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "#C9A227" }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "#F5F0E6" }}
                    >
                      {label}
                    </p>
                    <p className="text-sm" style={{ color: "#C8BBA8" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <GoldButton variant="primary" size="lg" asChild>
              <Link href="/products">
                Conhecer Lumina <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </GoldButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
