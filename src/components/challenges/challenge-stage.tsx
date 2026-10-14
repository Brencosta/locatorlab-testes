"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { BugProvider } from "@/components/bugs/bug-context";
import { ASSERTION_CHALLENGE_COMPONENTS } from "@/components/challenges/assertions";
import { LOCATOR_CHALLENGE_COMPONENTS } from "@/components/challenges/locators";
import type { BugId } from "@/lib/bugs/registry";
import type { ChallengeArea } from "@/lib/challenges/shared";

const COMPONENTS = {
  locators: LOCATOR_CHALLENGE_COMPONENTS,
  assertions: ASSERTION_CHALLENGE_COMPONENTS,
} satisfies Record<ChallengeArea, unknown>;

/**
 * Área de prática: mostra o componente interativo do desafio e um botão que
 * o devolve ao estado inicial.
 */
export function ChallengeStage({
  area,
  slug,
  bare,
  nonce,
  bugs,
}: {
  area: ChallengeArea;
  slug: string;
  /** Desafio sem id/data-testid: o contêiner também não recebe esses atributos. */
  bare: boolean;
  /** Valor gerado no servidor a cada carregamento (usado nos IDs dinâmicos). */
  nonce: string;
  /** Bugs do Modo Bug em vigor (lista vazia quando o modo está desligado). */
  bugs: readonly BugId[];
}) {
  const [run, setRun] = useState({ key: 0, nonce });
  const Challenge = COMPONENTS[area][slug];

  function restart() {
    setRun((current) => ({
      key: current.key + 1,
      nonce: Math.random().toString(16).slice(2, 8).padEnd(6, "0"),
    }));
  }

  return (
    <section
      aria-label="Área de prática"
      className="min-w-0 rounded-xl bg-card ring-1 ring-foreground/10"
      {...(bare ? {} : { "data-testid": "challenge-stage" })}
    >
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <h2 className="text-sm font-semibold">Área de prática</h2>
        <button
          type="button"
          onClick={restart}
          className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          {...(bare ? {} : { "data-testid": "challenge-restart-button" })}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reiniciar desafio
        </button>
      </div>
      <div className="p-4">
        <BugProvider bugs={bugs}>
          {Challenge ? <Challenge key={run.key} nonce={run.nonce} /> : null}
        </BugProvider>
      </div>
    </section>
  );
}
