import Link from "next/link";
import { Users, Search, UserPlus, Shield, ShieldOff, MailCheck, MailX } from "lucide-react";
import { getAdminSiteUsers } from "@/actions/site-users";

interface UsersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const { q } = await searchParams;
  const users = await getAdminSiteUsers(q);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: "rgba(201,162,39,0.1)" }}
          >
            <Users className="h-5 w-5" style={{ color: "#C9A227" }} />
          </div>
          <div>
            <h1
              className="font-serif text-2xl font-bold"
              style={{ color: "#F5F0E6" }}
            >
              Usuários
            </h1>
            <p className="text-sm" style={{ color: "rgba(200,187,168,0.6)" }}>
              {users.length} usuário{users.length !== 1 ? "s" : ""} cadastrado
              {users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ backgroundColor: "#C9A227", color: "#0A3D2F" }}
        >
          <UserPlus className="h-4 w-4" />
          Novo usuário
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "rgba(201,162,39,0.5)" }}
          />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por username ou email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "rgba(15,74,55,0.5)",
              border: "1px solid rgba(201,162,39,0.2)",
              color: "#F5F0E6",
            }}
          />
        </div>
      </form>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(201,162,39,0.15)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                backgroundColor: "rgba(201,162,39,0.06)",
                borderBottom: "1px solid rgba(201,162,39,0.15)",
              }}
            >
              {["Username", "E-mail", "Email", "Permissão", "Status", "Cadastro", "Ações"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase"
                    style={{ color: "rgba(200,187,168,0.6)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center"
                  style={{ color: "rgba(200,187,168,0.5)" }}
                >
                  Nenhum usuário encontrado.{" "}
                  <Link
                    href="/admin/users/new"
                    style={{ color: "#C9A227" }}
                    className="underline"
                  >
                    Criar o primeiro usuário
                  </Link>
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr
                  key={user.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(15,74,55,0.2)",
                    borderBottom: "1px solid rgba(201,162,39,0.07)",
                  }}
                >
                  {/* Username */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: "rgba(201,162,39,0.15)",
                          color: "#C9A227",
                        }}
                      >
                        {user.username[0].toUpperCase()}
                      </div>
                      <span style={{ color: "#F5F0E6" }}>{user.username}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3" style={{ color: "#C8BBA8" }}>
                    {user.email}
                  </td>

                  {/* Email verified */}
                  <td className="px-5 py-3">
                    {user.emailVerified ? (
                      <span
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: "#22c55e" }}
                        title="E-mail verificado"
                      >
                        <MailCheck className="h-3.5 w-3.5" /> Verificado
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: "#e05252" }}
                        title="E-mail não verificado"
                      >
                        <MailX className="h-3.5 w-3.5" /> Pendente
                      </span>
                    )}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3">
                    <span
                      className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-medium"
                      style={
                        user.role === "ADMIN"
                          ? { backgroundColor: "rgba(201,162,39,0.15)", color: "#C9A227" }
                          : { backgroundColor: "rgba(59,130,246,0.12)", color: "#60a5fa" }
                      }
                    >
                      {user.role === "ADMIN" ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <ShieldOff className="h-3 w-3" />
                      )}
                      {user.role === "ADMIN" ? "Admin" : "Usuário"}
                    </span>
                  </td>

                  {/* Active */}
                  <td className="px-5 py-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={
                        user.active
                          ? { backgroundColor: "rgba(34,197,94,0.12)", color: "#22c55e" }
                          : { backgroundColor: "rgba(224,82,82,0.12)", color: "#e05252" }
                      }
                    >
                      {user.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  {/* Date */}
                  <td
                    className="px-5 py-3 text-xs"
                    style={{ color: "rgba(200,187,168,0.5)" }}
                  >
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-xs font-medium hover:underline"
                      style={{ color: "#C9A227" }}
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
