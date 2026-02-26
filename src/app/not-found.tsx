import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground max-w-sm">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button asChild>
        <Link href="/">Voltar para a loja</Link>
      </Button>
    </div>
  );
}
