import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AccessDenied, ComingSoon } from "@/components/shared/states";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Painel Admin" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "ADMIN") {
    return (
      <AccessDenied
        action={
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline" })}
            data-testid="access-denied-back-link"
          >
            Voltar para o dashboard
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Painel Admin"
        description="Ferramentas do professor para gerenciar o ambiente."
      />
      <ComingSoon
        icon={ShieldCheck}
        title="Painel Admin em construção"
        description="Aqui o professor vai acompanhar a turma e controlar o ambiente de prática."
        features={[
          "Gerenciamento de usuários e papéis",
          "Restauração do banco com um clique",
          "Acompanhamento do progresso nos desafios",
          "Configuração dos cenários de aula",
        ]}
      />
    </>
  );
}
