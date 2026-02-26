import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { CustomSignInForm } from "@/components/auth/custom-sign-in-form";

export const metadata: Metadata = {
  title: "Entrar",
};

const DEMO_MODE = process.env.DEMO_MODE === "true";

export default function SignInPage() {
  if (DEMO_MODE) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#0A3D2F" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(201,162,39,0.06) 0%, transparent 50%), " +
              "radial-gradient(circle at 70% 80%, rgba(201,162,39,0.04) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div className="relative w-full max-w-sm">
          <div
            className="rounded-3xl p-8"
            style={{
              backgroundColor: "#0F4A37",
              border: "1px solid rgba(201,162,39,0.2)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            }}
          >
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
                Acesso exclusivo
              </p>
              <div
                className="mx-auto mt-4 h-px w-16"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #C9A227, transparent)",
                }}
              />
            </div>

            <CustomSignInForm />

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-xs hover:underline"
                style={{ color: "rgba(200,187,168,0.4)" }}
              >
                ← Voltar para o site
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <SignIn />
    </div>
  );
}
