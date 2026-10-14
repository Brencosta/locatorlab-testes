import { randomBytes } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeDetail } from "@/components/challenges/challenge-detail";
import { getActiveBugs } from "@/lib/bugs/server";
import {
  getLocatorChallenge,
  LOCATOR_CHALLENGES,
} from "@/lib/challenges/locators";

type Props = PageProps<"/challenges/locators/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const challenge = getLocatorChallenge(slug);
  return { title: challenge ? challenge.title : "Desafio não encontrado" };
}

export default async function LocatorChallengePage({ params }: Props) {
  const { slug } = await params;
  const challenge = getLocatorChallenge(slug);
  if (!challenge) notFound();

  return (
    <ChallengeDetail
      area="locators"
      basePath="/challenges/locators"
      challenge={challenge}
      challenges={LOCATOR_CHALLENGES}
      objectivesTitle="O que localizar"
      // Muda a cada carregamento da página (desafio de IDs dinâmicos).
      nonce={randomBytes(3).toString("hex")}
      // Lido a cada carregamento: ligar o Modo Bug vale a partir do próximo acesso.
      bugs={await getActiveBugs()}
    />
  );
}
