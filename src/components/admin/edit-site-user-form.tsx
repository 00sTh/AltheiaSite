"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Trash2 } from "lucide-react";
import { updateSiteUser, deleteSiteUser } from "@/actions/site-users";

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

interface EditSiteUserFormProps {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    active: boolean;
  };
}

export function EditSiteUserForm({ user }: EditSiteUserFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateSiteUser(user.id, formData);
      if (res.success) {
        router.push("/admin/users");
        router.refresh();
      } else {
        setError(res.error ?? "Erro ao salvar.");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Excluir o usuário "${user.username}"? Esta ação não pode ser desfeita.`)) return;
    setError(null);
    startDeleting(async () => {
      const res = await deleteSiteUser(user.id);
      if (res.success) {
        router.push("/admin/users");
        router.refresh();
      } else {
        setError(res.error ?? "Erro ao excluir.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {/* Username */}
      <div>
        <label style={labelStyle}>Username</label>
        <input
          name="username"
          type="text"
          defaultValue={user.username}
          autoComplete="off"
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>E-mail</label>
        <input
          name="email"
          type="email"
          defaultValue={user.email}
          autoComplete="off"
          style={inputStyle}
        />
      </div>

      {/* New password (optional) */}
      <div>
        <label style={labelStyle}>Nova senha (deixe em branco para manter)</label>
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
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
        <label style={labelStyle}>Permissão</label>
        <select name="role" defaultValue={user.role} style={{ ...inputStyle, cursor: "pointer" }}>
          <option value="USER">Usuário — apenas acessa o site</option>
          <option value="ADMIN">Administrador — acessa o painel admin</option>
        </select>
      </div>

      {/* Active */}
      <div className="flex items-center gap-3">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={user.active}
          value="true"
          className="h-4 w-4 rounded"
          style={{ accentColor: "#C9A227" }}
        />
        <label htmlFor="active" className="text-sm" style={{ color: "#C8BBA8" }}>
          Usuário ativo
        </label>
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

      {/* Buttons */}
      <div className="flex gap-3 pt-2 flex-wrap">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
          style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar
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
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 ml-auto px-4 py-3 rounded-xl text-sm font-medium disabled:opacity-60"
          style={{
            backgroundColor: "rgba(224,82,82,0.1)",
            border: "1px solid rgba(224,82,82,0.25)",
            color: "#e05252",
          }}
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Excluir
        </button>
      </div>
    </form>
  );
}
