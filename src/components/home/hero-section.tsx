"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { GoldButton } from "@/components/ui/gold-button";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  heroImageUrl?: string | null;
  heroVideoUrl?: string | null;
}

/** Extrai o ID do YouTube de qualquer formato de URL e retorna a embed URL. */
function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;

    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (
      u.hostname.includes("youtube.com") &&
      u.pathname.includes("/embed/")
    ) {
      id = u.pathname.split("/embed/")[1]?.split("?")[0] ?? null;
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");
    }

    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&playsinline=1&disablekb=1`;
  } catch {
    return null;
  }
}

export function HeroSection({
  title = "A Verdade da Beleza",
  subtitle = "Cosméticos de luxo formulados com ingredientes raros para revelar a luminosidade natural da sua pele.",
  heroImageUrl,
  heroVideoUrl,
}: HeroSectionProps) {
  const embedUrl = heroVideoUrl ? toYouTubeEmbed(heroVideoUrl) : null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — prioridade: vídeo > imagem > gradiente */}
      {embedUrl ? (
        <>
          {/* iframe do YouTube como fundo em loop */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <iframe
              src={embedUrl}
              title="Hero background video"
              allow="autoplay; encrypted-media"
              className="absolute w-[300%] h-[300%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
              style={{ minWidth: "100%", minHeight: "100%" }}
            />
          </div>
          {/* overlay esmeralda sobre o vídeo */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(10,61,47,0.65)" }}
          />
        </>
      ) : heroImageUrl ? (
        <>
          <Image
            src={heroImageUrl}
            alt="Hero"
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(10,61,47,0.60)" }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #051F18 0%, #0A3D2F 40%, #0F4A37 70%, #0A3D2F 100%)",
          }}
        />
      )}

      {/* Radial glow sutil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,162,39,0.06) 0%, transparent 70%)",
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

        {/* Linha dourada fina */}
        <motion.div
          variants={fadeInUp}
          className="mt-12 h-px max-w-xs mx-auto"
          style={{ backgroundColor: "rgba(201,162,39,0.30)" }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #0A3D2F, transparent)" }}
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
