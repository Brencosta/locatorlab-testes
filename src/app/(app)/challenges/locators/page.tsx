import type { Metadata } from "next";
import { ChallengeCatalog } from "@/components/challenges/challenge-catalog";
import { LOCATOR_CHALLENGES } from "@/lib/challenges/locators";
import { parseLevel } from "@/lib/challenges/shared";

export const metadata: Metadata = { title: "Desafios de Localizadores" };

export default async function LocatorChallengesPage({
  searchParams,
}: PageProps<"/challenges/locators">) {
  const { level } = await searchParams;

  return (
    <ChallengeCatalog
      title="Desafios de Localizadores"
      description="Pratique estratégias de localização de elementos, do id simples ao shadow DOM."
      basePath="/challenges/locators"
      challenges={LOCATOR_CHALLENGES}
      level={parseLevel(level)}
    />
  );
}
