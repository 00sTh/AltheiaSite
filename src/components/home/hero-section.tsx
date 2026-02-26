"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animations";

const particles = [
  { size: 4, top: "15%", left: "10%", duration: 6, delay: 0 },
  { size: 6, top: "25%", left: "85%", duration: 8, delay: 1 },
  { size: 3, top: "70%", left: "15%", duration: 7, delay: 2 },
  { size: 5, top: "60%", left: "90%", duration: 9, delay: 0.5 },
  { size: 4, top: "40%", left: "5%", duration: 6.5, delay: 3 },
  { size: 3, top: "80%", left: "75%", duration: 7.5, delay: 1.5 },
  { size: 6, top: "10%", left: "55%", duration: 8.5, delay: 2.5 },
  { size: 4, top: "50%", left: "95%", duration: 6, delay: 4 },
];

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export function HeroSection({
  title = "A Verdade da Beleza",
  subtitle = "Cosméticos de luxo formulados com ingredientes raros para revelar a luminosidade natural da sua pele.",
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #051F18 0%, #0A3D2F 40%, #0F4A37 70%, #0A3D2F 100%)",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,162,39,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Gold particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#C9A227] animate-float"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            "--duration": `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.4,
          } as React.CSSProperties}
        />
      ))}

      {/* Decorative lines */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 opacity-30"
        style={{
          background: "linear-gradient(to bottom, transparent, #C9A227)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 opacity-30"
        style={{
          background: "linear-gradient(to top, transparent, #C9A227)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Label */}
        <motion.div variants={fadeInUp} className="mb-8">
          <span className="inline-flex items-center gap-2 label-luxury text-[#C9A227] border border-[rgba(201,162,39,0.3)] rounded-full px-4 py-2">
            <Sparkles className="h-3 w-3" />
            Coleção Altheia 2026
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          variants={fadeInUp}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{ color: "#F5F0E6" }}
        >
          <span className="text-gradient-gold italic">{title}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#C8BBA8" }}
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <GoldButton variant="primary" size="lg" asChild>
            <Link href="/products">
              Explorar Coleção <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </GoldButton>
          <GoldButton variant="outline" size="lg" asChild>
            <Link href="/sobre-nos">Nossa História</Link>
          </GoldButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {[
            { value: "10+", label: "Anos de pesquisa" },
            { value: "100%", label: "Natural & Vegan" },
            { value: "50K+", label: "Clientes satisfeitas" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-serif text-2xl font-bold"
                style={{ color: "#C9A227" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs mt-1 label-luxury"
                style={{ color: "#C8BBA8" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to top, #0A3D2F, transparent)",
        }}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: "rgba(201,162,39,0.4)" }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: "#C9A227" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
