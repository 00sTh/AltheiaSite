import Link from "next/link";
import { Users, Search, ChevronRight, ShoppingBag } from "lucide-react";
import { getAdminUsers } from "@/actions/users";
import { formatPrice } from "@/lib/utils";

interface UsersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const { q } = await searchParams;
  const users = await getAdminUsers(q);

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
            placeholder="Buscar por email ou nome…"
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
              {["Usuário", "Email", "Pedidos", "Total gasto", "Cadastro", ""].map(
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
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr
                  key={user.id}
                  style={{
                    backgroundColor:
                      idx % 2 === 0
                        ? "transparent"
                        : "rgba(15,74,55,0.2)",
                    borderBottom: "1px solid rgba(201,162,39,0.07)",
                  }}
                >
                  {/* Name / avatar */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: "rgba(201,162,39,0.15)",
                            color: "#C9A227",
                          }}
                        >
                          {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                        </div>
                      )}
                      <span style={{ color: "#F5F0E6" }}>
                        {user.firstName || user.lastName
                          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                          : "—"}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3" style={{ color: "#C8BBA8" }}>
                    {user.email}
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag
                        className="h-3.5 w-3.5"
                        style={{ color: "rgba(201,162,39,0.6)" }}
                      />
                      <span style={{ color: "#F5F0E6" }}>{user.orderCount}</span>
                    </div>
                  </td>

                  {/* Total spent */}
                  <td
                    className="px-5 py-3 font-medium"
                    style={{ color: "#C9A227" }}
                  >
                    {formatPrice(user.totalSpent)}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3 text-xs" style={{ color: "rgba(200,187,168,0.5)" }}>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex items-center gap-1 text-xs font-medium hover:underline"
                      style={{ color: "#C9A227" }}
                    >
                      Ver <ChevronRight className="h-3 w-3" />
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
