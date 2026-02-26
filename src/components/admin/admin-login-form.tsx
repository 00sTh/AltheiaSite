"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { adminDemoLogin } from "@/actions/admin-auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await adminDemoLogin(formData);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error ?? "Credenciais inválidas.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Login */}
      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: "rgba(200,187,168,0.6)" }}
        >
          Usuário / E-mail
        </label>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          placeholder="admin"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            backgroundColor: "rgba(15,74,55,0.6)",
            border: "1px solid rgba(201,162,39,0.25)",
            color: "#F5F0E6",
          }}
        />
      </div>

      {/* Password */}
      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: "rgba(200,187,168,0.6)" }}
        >
          Senha
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "rgba(15,74,55,0.6)",
              border: "1px solid rgba(201,162,39,0.25)",
              color: "#F5F0E6",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(200,187,168,0.5)" }}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
        style={{
          backgroundColor: "#C9A227",
          color: "#0A3D2F",
        }}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        Entrar no painel
      </button>
    </form>
  );
}
