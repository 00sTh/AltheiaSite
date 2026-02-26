"use client";

import { motion } from "framer-motion";
import { FlaskConical, Leaf, ShieldCheck } from "lucide-react";
import { SectionTitle } from "@/components/ui/section-title";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const reasons = [
  {
    icon: FlaskConical,
    title: "Ciência de Ponta",
    description:
      "Nossa equipe de bioquímicos desenvolve fórmulas exclusivas baseadas nas últimas pesquisas dermatológicas internacionais.",
  },
  {
    icon: Leaf,
    title: "Ingredientes Premium",
    description:
      "Selecionamos os ativos mais raros e eficazes do planeta: péptidos marinhos, óleos botânicos e extratos de flores alpinas.",
  },
  {
    icon: ShieldCheck,
    title: "Resultados Comprovados",
    description:
      "Testado por dermatologistas e aprovado por mais de 50.000 clientes que reportaram visível melhora em 4 semanas.",
  },
];

export function WhyAltheia() {
  return (
    <section
      className="py-24 px-4"
      style={{ backgroundColor: "#0F4A37" }}
    >
      <div className="container mx-auto max-w-7xl">
        <SectionTitle
          label="Por que Altheia"
          title="O Padrão do Luxo Sustentável"
          subtitle="Cada produto é uma declaração de que a beleza real não exige compromissos com a natureza."
          align="center"
          className="mb-16"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reasons.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="relative group rounded-2xl p-8 transition-all duration-300"
              style={{
                backgroundColor: "rgba(10,61,47,0.6)",
                border: "1px solid rgba(201,162,39,0.15)",
              }}
              whileHover={{
                borderColor: "rgba(201,162,39,0.5)",
                boxShadow: "0 0 30px rgba(201,162,39,0.1)",
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  backgroundColor: "rgba(201,162,39,0.1)",
                  border: "1px solid rgba(201,162,39,0.3)",
                }}
              >
                <Icon className="h-6 w-6" style={{ color: "#C9A227" }} />
              </div>

              {/* Content */}
              <h3
                className="font-serif text-xl font-bold mb-3"
                style={{ color: "#F5F0E6" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#C8BBA8" }}>
                {description}
              </p>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #C9A227, transparent)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
