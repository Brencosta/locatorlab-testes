"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";

/** Conteúdo padrão dos arquivos error.tsx. */
export function RouteError({
  error,
  retry,
  title = "Não foi possível carregar esta página",
}: {
  error: Error & { digest?: string };
  retry: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      testId="error-state"
      heading="h1"
      title={title}
      description="Ocorreu um erro inesperado. Verifique sua conexão e tente novamente."
      action={
        <Button onClick={() => retry()} data-testid="error-retry-button">
          <RotateCw aria-hidden="true" />
          Tentar novamente
        </Button>
      }
    />
  );
}
