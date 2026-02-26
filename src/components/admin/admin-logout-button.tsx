"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminDemoLogout } from "@/actions/admin-auth";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!DEMO_MODE) return null;

  function handleLogout() {
    startTransition(async () => {
      await adminDemoLogout();
      router.push("/admin/login");
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-2 text-xs mt-2 rounded-lg w-full transition-colors hover:text-red-400 disabled:opacity-50"
      style={{ color: "rgba(224,82,82,0.7)" }}
    >
      <LogOut className="h-3.5 w-3.5" />
      Sair do painel
    </button>
  );
}
