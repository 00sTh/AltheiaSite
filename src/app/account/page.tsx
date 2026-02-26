import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Minha conta",
};

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  // Busca ou cria o perfil no banco ao primeiro acesso
  const profile = await prisma.userProfile.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser?.firstName,
      lastName: clerkUser?.lastName,
      avatarUrl: clerkUser?.imageUrl,
    },
  });

  // Últimos 5 pedidos
  const orders = await prisma.order.findMany({
    where: { userProfileId: profile.id },
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <UserButton />
        <div>
          <h1 className="text-2xl font-bold">
            Olá, {clerkUser?.firstName ?? "visitante"}!
          </h1>
          <p className="text-sm text-muted-foreground">
            {clerkUser?.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>

      {/* Últimos pedidos */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Últimos pedidos</h2>

        {orders.length === 0 ? (
          <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span
                    className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${
                      ORDER_STATUS_COLOR[order.status] ?? ""
                    }`}
                  >
                    {ORDER_STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
                <p className="text-sm">
                  {order.items.map((i) => i.product.name).join(", ")}
                </p>
                <p className="font-semibold text-primary">
                  {formatPrice(Number(order.total))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "long",
                  }).format(new Date(order.createdAt))}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
