import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { CreateSiteUserForm } from "@/components/admin/create-site-user-form";

export default function NewSiteUserPage() {
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
          <UserPlus className="h-5 w-5" style={{ color: "#C9A227" }} />
        </div>
        <div>
          <h1
            className="font-serif text-2xl font-bold"
            style={{ color: "#F5F0E6" }}
          >
            Novo Usuário
          </h1>
          <p className="text-sm" style={{ color: "rgba(200,187,168,0.5)" }}>
            Crie um usuário com acesso ao site
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
        <CreateSiteUserForm />
      </div>
    </div>
  );
}
