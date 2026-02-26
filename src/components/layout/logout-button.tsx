"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { siteLogout } from "@/actions/admin-auth";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleLogout() {
    startTransition(async () => {
      await siteLogout();
      router.push("/sign-in");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      title="Sair"
      className="flex items-center justify-center h-9 w-9 rounded-full transition-all disabled:opacity-50"
      style={{
        backgroundColor: "rgba(224,82,82,0.1)",
        border: "1px solid rgba(224,82,82,0.2)",
        color: "rgba(224,82,82,0.8)",
      }}
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
