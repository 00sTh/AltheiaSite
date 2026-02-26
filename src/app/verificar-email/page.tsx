import Link from "next/link";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { verifyEmailToken } from "@/lib/email-verify";
import { APP_NAME } from "@/lib/constants";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export const metadata = {
  title: "Verificar E-mail",
  robots: { index: false },
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;

  let result: { userId: string; email: string } | null = null;
  let error: string | null = null;

  if (!token) {
    error = "Token não informado.";
  } else {
    result = await verifyEmailToken(token);
    if (!result) {
      error = "Link inválido ou expirado. Solicite um novo link de verificação ao administrador.";
    }
  }

  const success = !!result;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0A3D2F" }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-8 text-center"
        style={{
          backgroundColor: "#0F4A37",
          border: "1px solid rgba(201,162,39,0.2)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <p
          className="font-serif text-xl font-bold tracking-[0.15em] uppercase mb-6"
          style={{ color: "#C9A227" }}
        >
          {APP_NAME}
        </p>

        {success ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16" style={{ color: "#22c55e" }} />
            </div>
            <h1
              className="font-serif text-2xl font-bold mb-2"
              style={{ color: "#F5F0E6" }}
            >
              E-mail confirmado!
            </h1>
            <p className="mb-2" style={{ color: "#C8BBA8" }}>
              O endereço{" "}
              <strong style={{ color: "#F5F0E6" }}>{result!.email}</strong>{" "}
              foi verificado com sucesso.
            </p>
            <p className="text-sm mb-8" style={{ color: "rgba(200,187,168,0.6)" }}>
              Sua conta está ativa. Faça login para continuar.
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
            >
              Entrar na conta
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              {token ? (
                <XCircle className="h-16 w-16" style={{ color: "#e05252" }} />
              ) : (
                <Mail className="h-16 w-16" style={{ color: "rgba(201,162,39,0.5)" }} />
              )}
            </div>
            <h1
              className="font-serif text-2xl font-bold mb-2"
              style={{ color: "#F5F0E6" }}
            >
              {token ? "Link inválido" : "Verificação de e-mail"}
            </h1>
            <p className="mb-8" style={{ color: "#C8BBA8" }}>
              {error}
            </p>
            <Link
              href="/"
              className="text-sm hover:underline"
              style={{ color: "rgba(200,187,168,0.6)" }}
            >
              ← Voltar para o site
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
