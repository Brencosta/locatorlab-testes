import type { Metadata } from "next";
import { BookOpenText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ComingSoon } from "@/components/shared/states";

export const metadata: Metadata = { title: "Documentação da API" };

export default function ApiDocsPage() {
  return (
    <>
      <PageHeader
        title="Documentação da API"
        description="Referência dos endpoints REST do LocatorLab."
      />
      <ComingSoon
        icon={BookOpenText}
        title="Documentação interativa em breve"
        description="A API já está disponível em /api/v1 e está descrita no README. Esta página trará a referência completa."
        features={[
          "Lista de endpoints com exemplos de requisição e resposta",
          "Status codes e formato padrão de erro",
          "Autenticação com Bearer token",
          "Exemplos prontos para Cypress, Playwright e Selenium",
        ]}
      />
    </>
  );
}
