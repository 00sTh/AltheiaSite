import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function AcessoNegadoPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#0A3D2F" }}
    >
      <div
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(201,162,39,0.1)",
          border: "1px solid rgba(201,162,39,0.25)",
        }}
      >
        <ShieldX className="h-9 w-9" style={{ color: "#C9A227" }} />
      </div>

      <h1
        className="font-serif text-4xl font-bold mb-3 text-center"
        style={{ color: "#F5F0E6" }}
      >
        Acesso Negado
      </h1>

      <div
        className="mb-6 h-px w-16"
        style={{ backgroundColor: "rgba(201,162,39,0.4)" }}
      />

      <p
        className="text-center max-w-sm mb-10 leading-relaxed"
        style={{ color: "rgba(200,187,168,0.7)" }}
      >
        Você não tem permissão para acessar esta área. Esta seção é restrita a administradores.
      </p>

      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,162,39,0.4)]"
        style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
      >
        Voltar para a loja
      </Link>
    </div>
  );
}
