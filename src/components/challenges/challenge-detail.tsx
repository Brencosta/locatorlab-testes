import Link from "next/link";
import { ArrowLeft, ArrowRight, Crosshair } from "lucide-react";
import { ChallengeHint } from "@/components/challenges/challenge-hint";
import { ChallengeStage } from "@/components/challenges/challenge-stage";
import { LevelBadge } from "@/components/challenges/level-badge";
import { FadeIn } from "@/components/shared/fade-in";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { BugId } from "@/lib/bugs/registry";
import type { Challenge, ChallengeArea } from "@/lib/challenges/shared";
import { cn } from "@/lib/utils";

/**
 * Página de um desafio: cabeçalho, lista de objetivos, área de prática, dica
 * recolhível e links para o desafio anterior e o próximo.
 */
export function ChallengeDetail({
  area,
  basePath,
  challenge,
  challenges,
  objectivesTitle,
  nonce,
  bugs,
}: {
  area: ChallengeArea;
  /** Ex.: "/challenges/locators" */
  basePath: string;
  challenge: Challenge;
  /** Todos os desafios da área, na ordem do catálogo. */
  challenges: Challenge[];
  /** Ex.: "O que localizar" */
  objectivesTitle: string;
  /** Valor que muda a cada carregamento da página. */
  nonce: string;
  /** Bugs do Modo Bug em vigor neste carregamento. */
  bugs: readonly BugId[];
}) {
  const index = challenges.indexOf(challenge);
  const previous = challenges[index - 1];
  const next = challenges[index + 1];

  return (
    <>
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        data-testid="challenge-back-link"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Todos os desafios
      </Link>

      <header className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-sm font-medium text-muted-foreground"
            data-testid="challenge-number"
          >
            Desafio {challenge.number} de {challenges.length}
          </span>
          <LevelBadge level={challenge.level} testId="challenge-level" />
          {challenge.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          data-testid="page-title"
        >
          {challenge.title}
        </h1>
        <p
          className="max-w-3xl text-sm leading-relaxed text-muted-foreground"
          data-testid="challenge-description"
        >
          {challenge.description}
        </p>
      </header>

      <FadeIn className="grid gap-4">
        <section
          aria-labelledby="objectives-title"
          className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          data-testid="challenge-objectives"
        >
          <h2
            id="objectives-title"
            className="mb-2 flex items-center gap-2 text-sm font-semibold"
          >
            <Crosshair className="size-4 text-primary" aria-hidden="true" />
            {objectivesTitle}
          </h2>
          <ol className="grid list-decimal gap-1.5 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
            {challenge.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ol>
        </section>

        <ChallengeStage
          area={area}
          slug={challenge.slug}
          bare={challenge.bare ?? false}
          nonce={nonce}
          bugs={bugs}
        />

        <ChallengeHint hints={challenge.hints} />

        <nav
          aria-label="Outros desafios"
          className="flex items-center justify-between gap-3"
        >
          {previous ? (
            <Link
              href={`${basePath}/${previous.slug}`}
              className={cn(buttonVariants({ variant: "outline" }), "min-w-0")}
              data-testid="challenge-previous-link"
            >
              <ArrowLeft aria-hidden="true" />
              <span className="truncate">
                <span className="sm:hidden">Anterior</span>
                <span className="hidden sm:inline">{previous.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`${basePath}/${next.slug}`}
              className={cn(buttonVariants({ variant: "outline" }), "min-w-0")}
              data-testid="challenge-next-link"
            >
              <span className="truncate">
                <span className="sm:hidden">Próximo</span>
                <span className="hidden sm:inline">{next.title}</span>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </FadeIn>
    </>
  );
}
