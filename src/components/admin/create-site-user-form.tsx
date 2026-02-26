"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createSiteUser } from "@/actions/site-users";

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

export function CreateSiteUserForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createSiteUser(formData);
      if (res.success) {
        router.push("/admin/users");
        router.refresh();
      } else {
        setError(res.error ?? "Erro ao criar usuário.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {/* Username */}
      <div>
        <label style={labelStyle}>Username *</label>
        <input
          name="username"
          type="text"
          required
          autoComplete="off"
          placeholder="ex: joao.silva"
          style={inputStyle}
        />
        <p className="text-xs mt-1" style={{ color: "rgba(200,187,168,0.4)" }}>
          Letras minúsculas, números, _ . - (mínimo 3 caracteres)
        </p>
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>E-mail *</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="email@exemplo.com"
          style={inputStyle}
        />
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>Senha *</label>
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            style={{ ...inputStyle, paddingRight: "2.75rem" }}
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

      {/* Role */}
      <div>
        <label style={labelStyle}>Permissão *</label>
        <select
          name="role"
          defaultValue="USER"
          style={{
            ...inputStyle,
            cursor: "pointer",
          }}
        >
          <option value="USER">Usuário — apenas acessa o site</option>
          <option value="ADMIN">Administrador — acessa o painel admin</option>
        </select>
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

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
          style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Criar usuário
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl text-sm font-medium"
          style={{
            backgroundColor: "rgba(15,74,55,0.4)",
            border: "1px solid rgba(201,162,39,0.2)",
            color: "#C8BBA8",
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
