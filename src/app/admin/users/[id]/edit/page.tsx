import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserCog } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EditSiteUserForm } from "@/components/admin/edit-site-user-form";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSiteUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const user = await prisma.siteUser.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, role: true, active: true },
  });

  if (!user) notFound();

  return (
    <div>
      <Link
        href="/admin/users"
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: "rgba(200,187,168,0.6)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para usuários
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: "rgba(201,162,39,0.1)" }}
        >
          <UserCog className="h-5 w-5" style={{ color: "#C9A227" }} />
        </div>
        <div>
          <h1
            className="font-serif text-2xl font-bold"
            style={{ color: "#F5F0E6" }}
          >
            Editar — {user.username}
          </h1>
          <p className="text-sm" style={{ color: "rgba(200,187,168,0.5)" }}>
            Altere dados ou senha do usuário
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: "rgba(15,74,55,0.2)",
          border: "1px solid rgba(201,162,39,0.12)",
        }}
      >
        <EditSiteUserForm user={user} />
      </div>
    </div>
  );
}
