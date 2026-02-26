"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface NossaHistoriaTeaserProps {
  videoUrl?: string;
  videoTitle?: string;
  videoDesc?: string;
}

export function NossaHistoriaTeaser({
  videoUrl,
  videoTitle = "A História da Altheia",
  videoDesc,
}: NossaHistoriaTeaserProps) {
  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ backgroundColor: "#0A3D2F" }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,162,39,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center space-y-10"
        >
          <motion.div variants={fadeInUp}>
            <SectionTitle
              label="Nossa Jornada"
              title="Nascida da Natureza, Criada pela Ciência"
              subtitle="Em 2014, a bioquímica Ana Altheia começou a pesquisar ativos naturais brasileiros em seu laboratório em Gramado. O que era uma paixão se tornou uma revolução na skincare de luxo."
              align="center"
              animate={false}
            />
          </motion.div>

          {/* Video teaser card */}
          <motion.div variants={fadeInUp}>
            <div
              className="relative rounded-3xl overflow-hidden mx-auto max-w-2xl cursor-pointer group"
              style={{
                background: "linear-gradient(135deg, #0F4A37 0%, #145A43 100%)",
                border: "1px solid rgba(201,162,39,0.25)",
                aspectRatio: "16/9",
              }}
            >
              {/* Background texture */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 40%, rgba(201,162,39,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(30,122,90,0.6) 0%, transparent 40%)",
                }}
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="flex flex-col items-center gap-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(201,162,39,0.5)]"
                    style={{
                      backgroundColor: "rgba(201,162,39,0.15)",
                      border: "2px solid rgba(201,162,39,0.6)",
                    }}
                  >
                    <Play
                      className="h-8 w-8 ml-1"
                      style={{ color: "#C9A227" }}
                    />
                  </div>
                  <p
                    className="font-serif text-xl italic"
                    style={{ color: "#F5F0E6" }}
                  >
                    {videoTitle}
                  </p>
                </motion.div>
              </div>

              {/* Bottom gradient */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{
                  background: "linear-gradient(to top, rgba(10,61,47,0.8), transparent)",
                }}
              />

              {/* Duration badge */}
              <div
                className="absolute bottom-4 right-4 px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#C8BBA8",
                }}
              >
                3:47
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center gap-4 flex-wrap">
            <GoldButton variant="primary" size="lg" asChild>
              <Link href="/videos">
                Ver Todos os Vídeos <Play className="h-4 w-4 ml-1" />
              </Link>
            </GoldButton>
            <GoldButton variant="outline" size="lg" asChild>
              <Link href="/sobre-nos">
                Nossa Missão <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </GoldButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
