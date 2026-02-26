import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Frete grátis acima de R$199",
    description: "Entrega em todo o Brasil sem custo adicional.",
  },
  {
    icon: RotateCcw,
    title: "Devolução em 30 dias",
    description: "Satisfação garantida ou seu dinheiro de volta.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento seguro",
    description: "Transações criptografadas e dados protegidos.",
  },
];

export function WhyAltheia() {
  return (
    <section
      className="py-8 px-4"
      style={{
        backgroundColor: "#0F4A37",
        borderTop: "1px solid rgba(201,162,39,0.15)",
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(201,162,39,0.2)]">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 px-8 py-6">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#C9A227" }} />
              <div>
                <p
                  className="font-medium text-sm mb-1"
                  style={{ color: "#F5F0E6" }}
                >
                  {title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#C8BBA8" }}>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
