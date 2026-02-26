import Link from "next/link";
import { ShieldX, ArrowLeft, Lock } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Acesso Negado — ${APP_NAME}`,
  robots: { index: false },
};

export default function AcessoNegadoPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0A3D2F" }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(224,82,82,0.06) 0%, transparent 55%), " +
            "radial-gradient(circle at 20% 80%, rgba(201,162,39,0.04) 0%, transparent 45%)",
        }}
      />

      <div className="relative w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="p-5 rounded-full"
            style={{
              backgroundColor: "rgba(224,82,82,0.1)",
              border: "1px solid rgba(224,82,82,0.25)",
            }}
          >
            <ShieldX className="h-10 w-10" style={{ color: "#e05252" }} />
          </div>
        </div>

        {/* Brand */}
        <p
          className="font-serif text-sm tracking-[0.2em] uppercase mb-3"
          style={{ color: "rgba(201,162,39,0.7)" }}
        >
          {APP_NAME}
        </p>

        {/* Divider */}
        <div
          className="mx-auto mb-6 h-px w-16"
          style={{
            background: "linear-gradient(to right, transparent, rgba(224,82,82,0.5), transparent)",
          }}
        />

        {/* Main message */}
        <h1
          className="font-serif text-4xl font-bold mb-3"
          style={{ color: "#F5F0E6" }}
        >
          Acesso Negado
        </h1>
        <p
          className="text-base mb-2"
          style={{ color: "rgba(200,187,168,0.7)" }}
        >
          Você não tem permissão para acessar esta área.
        </p>
        <p
          className="text-sm mb-10"
          style={{ color: "rgba(200,187,168,0.45)" }}
        >
          Se acredita que isto é um erro, entre em contato com o administrador.
        </p>

        {/* Card with info */}
        <div
          className="rounded-2xl p-5 mb-8 text-left"
          style={{
            backgroundColor: "rgba(15,74,55,0.4)",
            border: "1px solid rgba(224,82,82,0.15)",
          }}
        >
          <div className="flex items-start gap-3">
            <Lock
              className="h-4 w-4 mt-0.5 shrink-0"
              style={{ color: "#e05252" }}
            />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "#F5F0E6" }}>
                Área restrita
              </p>
              <p className="text-xs" style={{ color: "rgba(200,187,168,0.5)" }}>
                Esta seção requer privilégios de administrador. Faça login com
                uma conta autorizada ou retorne ao site.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <Link
            href="/sign-in?redirect_url=/admin"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: "rgba(15,74,55,0.5)",
              border: "1px solid rgba(201,162,39,0.2)",
              color: "#C8BBA8",
            }}
          >
            Entrar com outra conta
          </Link>
        </div>
      </div>
    </div>
  );
}
