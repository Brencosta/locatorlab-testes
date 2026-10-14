import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { LevelBadge } from "@/components/challenges/level-badge";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/states";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  CHALLENGE_LEVELS,
  LEVEL_LABELS,
  type Challenge,
  type ChallengeLevel,
} from "@/lib/challenges/shared";
import { cn } from "@/lib/utils";

/** Catálogo de uma área de desafios, com filtro por nível na URL (?level=). */
export function ChallengeCatalog({
  title,
  description,
  basePath,
  challenges: allChallenges,
  level,
}: {
  title: string;
  description: string;
  /** Ex.: "/challenges/locators" */
  basePath: string;
  challenges: Challenge[];
  level: ChallengeLevel | undefined;
}) {
  const challenges = level
    ? allChallenges.filter((challenge) => challenge.level === level)
    : allChallenges;

  const filters: Array<{ value: ChallengeLevel | null; label: string }> = [
    { value: null, label: "Todos" },
    ...CHALLENGE_LEVELS.map((value) => ({ value, label: LEVEL_LABELS[value] })),
  ];

  return (
    <>
      <PageHeader title={title} description={description} />

      <nav
        aria-label="Filtrar por nível"
        className="mb-3 flex flex-wrap gap-2"
        data-testid="level-filters"
      >
        {filters.map((filter) => {
          const active = (filter.value ?? undefined) === level;
          const count = filter.value
            ? allChallenges.filter((c) => c.level === filter.value).length
            : allChallenges.length;

          return (
            <Link
              key={filter.label}
              href={filter.value ? `${basePath}?level=${filter.value}` : basePath}
              aria-current={active ? "true" : undefined}
              data-testid={`level-filter-${filter.value ?? "all"}`}
              className={cn(
                buttonVariants({
                  variant: active ? "default" : "outline",
                  size: "sm",
                }),
                "rounded-full",
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "tabular-nums",
                  active ? "text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      <p
        className="mb-4 text-sm text-muted-foreground"
        aria-live="polite"
        data-testid="challenges-count"
        data-total={challenges.length}
      >
        {challenges.length === 1
          ? "1 desafio"
          : `${challenges.length} desafios`}
        {level ? ` de nível ${LEVEL_LABELS[level].toLowerCase()}` : ""}
      </p>

      {challenges.length === 0 ? (
        <EmptyState
          testId="challenges-empty-state"
          icon={SearchX}
          title="Nenhum desafio neste nível"
          description="Escolha outro nível para ver os desafios disponíveis."
        />
      ) : (
        <FadeIn>
          <ul
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            data-testid="challenges-list"
          >
            {challenges.map((challenge) => (
              <li key={challenge.slug}>
                <Link
                  href={`${basePath}/${challenge.slug}`}
                  data-testid={`challenge-card-${challenge.slug}`}
                  data-level={challenge.level}
                  className="group flex h-full flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow outline-none hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary tabular-nums">
                      {challenge.number}
                    </span>
                    <LevelBadge level={challenge.level} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="leading-snug font-semibold">
                      {challenge.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {challenge.summary}
                    </p>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-1">
                      {challenge.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      )}
    </>
  );
}
