"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/admin";

interface Props {
  id: string;
  name: string;
  productCount: number;
}

export function CategoryDeleteButton({ id, name, productCount }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (productCount > 0) {
      setError(`Mova ou delete os ${productCount} produto(s) antes de excluir esta categoria.`);
      return;
    }
    if (!confirm(`Excluir categoria "${name}"?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (!result.success) setError(result.error ?? "Erro ao excluir");
    });
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="h-8 w-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-50"
        style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171" }}
        title="Excluir"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      {error && (
        <p className="text-xs mt-1 max-w-xs" style={{ color: "#F87171" }}>{error}</p>
      )}
    </div>
  );
}
