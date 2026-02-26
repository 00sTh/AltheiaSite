import { redirect } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

const DEMO_MODE = process.env.DEMO_MODE === "true";

export const metadata = {
  title: `Admin — ${APP_NAME}`,
  robots: { index: false },
};

export default async function AdminLoginPage() {
  // Em produção (Clerk), redirecionar para /sign-in com callback
  if (!DEMO_MODE) {
    redirect("/sign-in?redirect_url=/admin");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0A3D2F" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(201,162,39,0.06) 0%, transparent 50%), " +
            "radial-gradient(circle at 70% 80%, rgba(201,162,39,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            backgroundColor: "#0F4A37",
            border: "1px solid rgba(201,162,39,0.2)",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,162,39,0.05)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <h1
              className="font-serif text-3xl font-bold tracking-[0.12em] uppercase mb-1"
              style={{ color: "#C9A227" }}
            >
              {APP_NAME}
            </h1>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(200,187,168,0.5)" }}
            >
              Painel Administrativo
            </p>

            {/* Divider */}
            <div
              className="mx-auto mt-4 h-px w-16"
              style={{
                background:
                  "linear-gradient(to right, transparent, #C9A227, transparent)",
              }}
            />
          </div>

          {/* Demo credentials hint */}
          {DEMO_MODE && (
            <div
              className="rounded-xl px-4 py-3 mb-6 text-xs"
              style={{
                backgroundColor: "rgba(201,162,39,0.07)",
                border: "1px solid rgba(201,162,39,0.2)",
                color: "rgba(200,187,168,0.7)",
              }}
            >
              <p className="font-semibold mb-0.5" style={{ color: "#C9A227" }}>
                Modo Demo
              </p>
              <p>
                Usuário: <code className="font-mono">admin</code>
                &nbsp;·&nbsp;
                Senha: <code className="font-mono">altheia2024</code>
              </p>
            </div>
          )}

          <AdminLoginForm />

          {/* Back link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs hover:underline"
              style={{ color: "rgba(200,187,168,0.5)" }}
            >
              ← Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
