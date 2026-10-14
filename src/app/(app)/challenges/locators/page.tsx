import type { Metadata } from "next";
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
  LOCATOR_CHALLENGES,
  type ChallengeLevel,
} from "@/lib/challenges/locators";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Desafios de Localizadores" };

function parseLevel(value: string | string[] | undefined) {
  const single = Array.isArray(value) ? value[0] : value;
  return CHALLENGE_LEVELS.find((level) => level === single);
}

export default async function LocatorChallengesPage({
  searchParams,
}: PageProps<"/challenges/locators">) {
  const { level: rawLevel } = await searchParams;
  const level = parseLevel(rawLevel);

  const challenges = level
    ? LOCATOR_CHALLENGES.filter((challenge) => challenge.level === level)
    : LOCATOR_CHALLENGES;

  const filters: Array<{ value: ChallengeLevel | null; label: string }> = [
    { value: null, label: "Todos" },
    ...CHALLENGE_LEVELS.map((value) => ({ value, label: LEVEL_LABELS[value] })),
  ];

  return (
    <>
      <PageHeader
        title="Desafios de Localizadores"
        description="Pratique estratégias de localização de elementos, do id simples ao shadow DOM."
      />

      <nav
        aria-label="Filtrar por nível"
        className="mb-3 flex flex-wrap gap-2"
        data-testid="level-filters"
      >
        {filters.map((filter) => {
          const active = (filter.value ?? undefined) === level;
          const count = filter.value
            ? LOCATOR_CHALLENGES.filter((c) => c.level === filter.value).length
            : LOCATOR_CHALLENGES.length;

          return (
            <Link
              key={filter.label}
              href={
                filter.value
                  ? `/challenges/locators?level=${filter.value}`
                  : "/challenges/locators"
              }
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
                  active ? "text-primary-foreground/80" : "text-muted-foreground",
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
                  href={`/challenges/locators/${challenge.slug}`}
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
