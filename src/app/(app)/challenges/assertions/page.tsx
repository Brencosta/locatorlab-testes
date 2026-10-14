import type { Metadata } from "next";
import { ChallengeCatalog } from "@/components/challenges/challenge-catalog";
import { ASSERTION_CHALLENGES } from "@/lib/challenges/assertions";
import { parseLevel } from "@/lib/challenges/shared";

export const metadata: Metadata = { title: "Desafios de Assertions" };

export default async function AssertionChallengesPage({
  searchParams,
}: PageProps<"/challenges/assertions">) {
  const { level } = await searchParams;

  return (
    <ChallengeCatalog
      title="Desafios de Assertions"
      description="Pratique a escrita de verificações: texto, estado, atributos, URL, contagens, cálculos e respostas de API."
      basePath="/challenges/assertions"
      challenges={ASSERTION_CHALLENGES}
      level={parseLevel(level)}
    />
  );
}
