"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, FlaskConical, Globe, Sparkles } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from "@/lib/animations";

const values = [
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description:
      "Cada ingrediente é sourced de forma responsável, respeitando os ecossistemas e as comunidades locais.",
  },
  {
    icon: FlaskConical,
    title: "Inovação",
    description:
      "Nosso laboratório opera na fronteira da ciência cosmética, combinando tradição botânica com biotecnologia moderna.",
  },
  {
    icon: Heart,
    title: "Cuidado",
    description:
      "Formulamos pensando em cada tipo de pele, garantindo que toda mulher encontre o produto ideal para si.",
  },
  {
    icon: Globe,
    title: "Impacto",
    description:
      "5% de cada venda é destinado a projetos de preservação da Mata Atlântica e capacitação de comunidades quilombolas.",
  },
];

const timeline = [
  { year: "2014", event: "Fundação do laboratório em Gramado, RS" },
  { year: "2016", event: "Lançamento do primeiro produto: Sérum Lumina" },
  { year: "2019", event: "Expansão para 500 pontos de venda no Brasil" },
  { year: "2022", event: "Certificação B Corp e expansão para Europa" },
  { year: "2025", event: "Premio Beauty Awards — Melhor Marca de Luxo Sustentável" },
  { year: "2026", event: "Lançamento da nova plataforma digital Altheia" },
];

interface SobreNosContentProps {
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl?: string;
}

export function SobreNosContent({ aboutTitle, aboutText }: SobreNosContentProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A3D2F" }}>
      {/* Hero */}
      <div
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{
          backgroundColor: "#0F4A37",
          borderBottom: "1px solid rgba(201,162,39,0.2)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,162,39,0.07) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span
            className="inline-flex items-center gap-2 label-luxury mb-6"
            style={{ color: "#C9A227" }}
          >
            <Sparkles className="h-3 w-3" />
            Nossa Essência
          </span>
          <h1
            className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ color: "#F5F0E6" }}
          >
            <span className="text-gradient-gold italic">{aboutTitle}</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#C8BBA8" }}
          >
            {aboutText}
          </p>
        </motion.div>
      </div>

      {/* Missão */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
            >
              <SectionTitle
                label="Nossa Missão"
                title="Revelar a Beleza Real"
                subtitle="Acreditamos que cada pessoa carrega uma beleza única. Nossa missão é criar produtos que ressaltem essa autenticidade — com ciência, ética e um profundo respeito pela natureza."
                align="left"
                animate={false}
              />
              <div className="mt-8 space-y-4">
                {[
                  "Ingredientes 100% naturais e veganos",
                  "Fórmulas testadas por dermatologistas",
                  "Embalagens biodegradáveis ou recicláveis",
                  "Produção carbono-neutro desde 2023",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "#C9A227" }}
                    />
                    <span className="text-sm" style={{ color: "#C8BBA8" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <div
                className="relative rounded-3xl p-12 text-center"
                style={{
                  background: "linear-gradient(135deg, #0F4A37 0%, #145A43 100%)",
                  border: "1px solid rgba(201,162,39,0.25)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(circle at 60% 40%, rgba(201,162,39,0.12) 0%, transparent 60%)",
                  }}
                />
                <div className="relative z-10">
                  <p className="font-serif text-6xl font-bold mb-3" style={{ color: "#C9A227" }}>
                    10+
                  </p>
                  <p className="label-luxury mb-8" style={{ color: "#C8BBA8" }}>
                    Anos de Pesquisa
                  </p>
                  <div
                    className="h-px my-6"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(201,162,39,0.4), transparent)",
                    }}
                  />
                  <p className="font-serif text-6xl font-bold mb-3" style={{ color: "#C9A227" }}>
                    50K+
                  </p>
                  <p className="label-luxury" style={{ color: "#C8BBA8" }}>
                    Clientes no Brasil e Europa
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 px-4" style={{ backgroundColor: "#0F4A37" }}>
        <div className="container mx-auto max-w-7xl">
          <SectionTitle
            label="Nossos Valores"
            title="O que nos Guia"
            subtitle="Cada decisão na Altheia é tomada com base em quatro pilares fundamentais."
            align="center"
            className="mb-16"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="flex gap-5 p-6 rounded-2xl"
                style={{
                  backgroundColor: "rgba(10,61,47,0.5)",
                  border: "1px solid rgba(201,162,39,0.12)",
                }}
                whileHover={{ borderColor: "rgba(201,162,39,0.4)", boxShadow: "0 0 20px rgba(201,162,39,0.08)" }}
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.3)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "#C9A227" }} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-2" style={{ color: "#F5F0E6" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#C8BBA8" }}>
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <SectionTitle
            label="Nossa Trajetória"
            title="Uma Jornada de Dedicação"
            align="center"
            className="mb-16"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative"
          >
            <div
              className="absolute left-12 top-0 bottom-0 w-px hidden sm:block"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(201,162,39,0.3) 10%, rgba(201,162,39,0.3) 90%, transparent)",
              }}
            />
            <div className="space-y-8">
              {timeline.map(({ year, event }) => (
                <motion.div key={year} variants={fadeInUp} className="flex items-start gap-6 sm:gap-8">
                  <div
                    className="shrink-0 w-24 h-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10"
                    style={{ backgroundColor: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.4)", color: "#C9A227" }}
                  >
                    {year}
                  </div>
                  <div
                    className="flex-1 py-3 px-5 rounded-xl"
                    style={{ backgroundColor: "#0F4A37", border: "1px solid rgba(201,162,39,0.12)" }}
                  >
                    <p className="text-sm" style={{ color: "#C8BBA8" }}>{event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
