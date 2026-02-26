import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, Package } from "lucide-react";
import { getAdminUser } from "@/actions/users";
import { formatPrice } from "@/lib/utils";
import { parseImages } from "@/lib/utils";
import { UserRoleButton, UserDeleteButton } from "@/components/admin/user-actions";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "rgba(201,162,39,0.2)",
  PAID: "rgba(34,197,94,0.2)",
  SHIPPED: "rgba(59,130,246,0.2)",
  DELIVERED: "rgba(34,197,94,0.3)",
  CANCELLED: "rgba(224,82,82,0.2)",
};

const STATUS_TEXT: Record<string, string> = {
  PENDING: "#C9A227",
  PAID: "#22c55e",
  SHIPPED: "#3b82f6",
  DELIVERED: "#22c55e",
  CANCELLED: "#e05252",
};

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = await getAdminUser(id);
  if (!user) notFound();

  const totalSpent = user.orders.reduce(
    (acc, o) => acc + Number(o.price),
    0
  );
  const paidOrders = user.orders.filter((o) => o.status === "PAID");
  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : null;

  return (
    <div>
      {/* Back */}
      <Link
        href="/admin/users"
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: "rgba(200,187,168,0.6)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para usuários
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8 flex-wrap">
        {/* Avatar */}
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt=""
            className="h-20 w-20 rounded-2xl object-cover"
            style={{ border: "1px solid rgba(201,162,39,0.2)" }}
          />
        ) : (
          <div
            className="h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-bold font-serif"
            style={{
              backgroundColor: "rgba(201,162,39,0.1)",
              border: "1px solid rgba(201,162,39,0.2)",
              color: "#C9A227",
            }}
          >
            {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1
            className="font-serif text-2xl font-bold mb-1"
            style={{ color: "#F5F0E6" }}
          >
            {fullName ?? "Usuário sem nome"}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm mt-2">
            <span className="flex items-center gap-1.5" style={{ color: "#C8BBA8" }}>
              <Mail className="h-3.5 w-3.5" style={{ color: "rgba(201,162,39,0.6)" }} />
              {user.email}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: "#C8BBA8" }}>
              <Calendar className="h-3.5 w-3.5" style={{ color: "rgba(201,162,39,0.6)" }} />
              Cliente desde{" "}
              {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(200,187,168,0.4)" }}>
            Clerk ID: {user.clerkId}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total de pedidos", value: user.orders.length },
          { label: "Pedidos pagos", value: paidOrders.length },
          {
            label: "Total gasto",
            value: formatPrice(totalSpent),
            gold: true,
          },
          {
            label: "Ticket médio",
            value:
              paidOrders.length > 0
                ? formatPrice(
                    paidOrders.reduce((acc, o) => acc + Number(o.price), 0) /
                      paidOrders.length
                  )
                : "—",
          },
        ].map(({ label, value, gold }) => (
          <div
            key={label}
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "rgba(15,74,55,0.3)",
              border: "1px solid rgba(201,162,39,0.12)",
            }}
          >
            <p
              className="text-xs mb-1"
              style={{ color: "rgba(200,187,168,0.5)" }}
            >
              {label}
            </p>
            <p
              className="font-serif text-xl font-bold"
              style={{ color: gold ? "#C9A227" : "#F5F0E6" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        className="rounded-2xl p-5 mb-8 flex flex-wrap gap-4 items-start"
        style={{
          backgroundColor: "rgba(15,74,55,0.2)",
          border: "1px solid rgba(201,162,39,0.12)",
        }}
      >
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "rgba(200,187,168,0.5)" }}
          >
            Ações
          </p>
          <div className="flex flex-wrap gap-3">
            <UserRoleButton
              userId={user.id}
              clerkId={user.clerkId}
            />
            <UserDeleteButton userId={user.id} />
          </div>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2
          className="font-serif text-lg font-bold mb-4 flex items-center gap-2"
          style={{ color: "#F5F0E6" }}
        >
          <Package className="h-5 w-5" style={{ color: "rgba(201,162,39,0.6)" }} />
          Histórico de pedidos ({user.orders.length})
        </h2>

        {user.orders.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              backgroundColor: "rgba(15,74,55,0.2)",
              border: "1px solid rgba(201,162,39,0.1)",
            }}
          >
            <p style={{ color: "rgba(200,187,168,0.5)" }}>
              Este usuário ainda não fez pedidos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: "rgba(15,74,55,0.2)",
                  border: "1px solid rgba(201,162,39,0.1)",
                }}
              >
                <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-mono"
                      style={{ color: "rgba(200,187,168,0.5)" }}
                    >
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: STATUS_COLOR[order.status] ?? "transparent",
                        color: STATUS_TEXT[order.status] ?? "#C8BBA8",
                      }}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(200,187,168,0.4)" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className="font-serif font-bold"
                      style={{ color: "#C9A227" }}
                    >
                      {formatPrice(Number(order.price))}
                    </span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-medium hover:underline"
                      style={{ color: "#C9A227" }}
                    >
                      Ver pedido →
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-3">
                  {order.items.map((item) => {
                    const imgs = parseImages(
                      item.product.images as unknown as string
                    );
                    return (
                      <div key={item.id} className="flex items-center gap-2">
                        {imgs[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imgs[0]}
                            alt={item.product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                            style={{
                              border: "1px solid rgba(201,162,39,0.15)",
                            }}
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded-lg"
                            style={{
                              backgroundColor: "rgba(201,162,39,0.1)",
                            }}
                          />
                        )}
                        <div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: "#F5F0E6" }}
                          >
                            {item.product.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "rgba(200,187,168,0.5)" }}
                          >
                            x{item.quantity} · {formatPrice(Number(item.price))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
