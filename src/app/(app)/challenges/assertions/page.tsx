import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ComingSoon } from "@/components/shared/states";

export const metadata: Metadata = { title: "Desafios de Assertions" };

export default function AssertionChallengesPage() {
  return (
    <>
      <PageHeader
        title="Desafios de Assertions"
        description="Exercícios para treinar a escrita de verificações nos testes."
      />
      <ComingSoon
        icon={CheckCircle2}
        title="Desafios de Assertions chegam em breve"
        description="Cenários preparados para você validar o comportamento da interface e da API."
        features={[
          "Texto, visibilidade e estado dos elementos",
          "Atributos, classes e valores de campos",
          "URL, título da página e navegação",
          "Quantidade de itens e respostas de API",
        ]}
      />
    </>
  );
}
