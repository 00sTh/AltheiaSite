import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin — Dashboard",
};

export default async function AdminDashboard() {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");

  // Dupla verificação de role (middleware já protege, mas defense-in-depth)
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") redirect("/");

  // Métricas básicas
  const [totalProducts, totalOrders, totalRevenue, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          userProfile: { select: { email: true } },
          items: { select: { quantity: true } },
        },
      }),
    ]);

  const revenue = totalRevenue._sum.total ?? 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Dashboard Admin
      </h1>

      {/* Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
        <MetricCard title="Produtos ativos" value={String(totalProducts)} />
        <MetricCard title="Pedidos totais" value={String(totalOrders)} />
        <MetricCard
          title="Receita confirmada"
          value={formatPrice(Number(revenue))}
          highlight
        />
      </div>

      {/* Pedidos recentes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pedidos recentes</h2>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Cliente</th>
                <th className="px-4 py-3 text-left font-medium">Itens</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">{order.userProfile.email}</td>
                  <td className="px-4 py-3">
                    {order.items.reduce((a, i) => a + i.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border p-6 space-y-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
