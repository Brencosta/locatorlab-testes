import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/states";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <EmptyState
          testId="not-found"
          icon={SearchX}
          title="Página não encontrada (404)"
          description="O endereço que você tentou acessar não existe ou foi movido."
          action={
            <Link
              href="/dashboard"
              className={buttonVariants()}
              data-testid="not-found-home-link"
            >
              Voltar para o início
            </Link>
          }
        />
      </div>
    </main>
  );
}
