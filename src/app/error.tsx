"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Error boundary global — captura erros não tratados em Server Components */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Em produção, enviar para serviço de monitoramento (ex: Sentry)
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-2xl font-bold">Algo deu errado</h2>
      <p className="text-muted-foreground max-w-sm">
        Ocorreu um erro inesperado. Nossa equipe foi notificada.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
