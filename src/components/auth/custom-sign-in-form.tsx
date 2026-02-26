"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, LogIn } from "lucide-react";
import { siteLogin } from "@/actions/admin-auth";

export function CustomSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await siteLogin(formData);
      if (res.success) {
        if (res.warning) setWarning(res.warning);
        const redirectUrl = searchParams.get("redirect_url");
        router.push(redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : "/");
        router.refresh();
      } else {
        setError(res.error ?? "Erro ao entrar.");
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(15,74,55,0.6)",
    border: "1px solid rgba(201,162,39,0.25)",
    color: "#F5F0E6",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    color: "rgba(200,187,168,0.6)",
    fontSize: "0.72rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: "0.375rem",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label style={labelStyle}>Usuário ou e-mail</label>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          style={inputStyle}
          placeholder="seu_usuario"
        />
      </div>

      <div>
        <label style={labelStyle}>Senha</label>
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            required
            style={{ ...inputStyle, paddingRight: "2.75rem" }}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(200,187,168,0.5)" }}
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p
          className="text-sm rounded-xl px-4 py-2"
          style={{
            color: "#e05252",
            backgroundColor: "rgba(224,82,82,0.1)",
            border: "1px solid rgba(224,82,82,0.2)",
          }}
        >
          {error}
        </p>
      )}

      {warning && (
        <p
          className="text-sm rounded-xl px-4 py-2"
          style={{
            color: "#C9A227",
            backgroundColor: "rgba(201,162,39,0.1)",
            border: "1px solid rgba(201,162,39,0.25)",
          }}
        >
          ⚠ {warning}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
        style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        Entrar
      </button>
    </form>
  );
}
