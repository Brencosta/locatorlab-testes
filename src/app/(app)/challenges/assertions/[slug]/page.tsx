import { randomBytes } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeDetail } from "@/components/challenges/challenge-detail";
import { getActiveBugs } from "@/lib/bugs/server";
import {
  ASSERTION_CHALLENGES,
  getAssertionChallenge,
} from "@/lib/challenges/assertions";
import {
  parseStoreSection,
  STORE_SECTIONS,
} from "@/lib/challenges/url-and-title";

type Props = PageProps<"/challenges/assertions/[slug]">;

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const challenge = getAssertionChallenge(slug);
  if (!challenge) return { title: "Desafio não encontrado" };

  // No desafio de URL e título, o título da aba acompanha a seção da mini loja.
  if (slug === "url-and-title") {
    const { section } = await searchParams;
    return { title: STORE_SECTIONS[parseStoreSection(section)].title };
  }

  return { title: challenge.title };
}

export default async function AssertionChallengePage({ params }: Props) {
  const { slug } = await params;
  const challenge = getAssertionChallenge(slug);
  if (!challenge) notFound();

  return (
    <ChallengeDetail
      area="assertions"
      basePath="/challenges/assertions"
      challenge={challenge}
      challenges={ASSERTION_CHALLENGES}
      objectivesTitle="O que validar"
      nonce={randomBytes(3).toString("hex")}
      // Lido a cada carregamento: ligar o Modo Bug vale a partir do próximo acesso.
      bugs={await getActiveBugs()}
    />
  );
}
