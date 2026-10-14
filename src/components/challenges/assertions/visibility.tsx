"use client";

import { useState } from "react";
import { Panel, ui } from "@/components/challenges/ui";

type Technique = "display" | "visibility" | "opacity" | "hidden-attr" | "removed";

const BOXES: Array<{
  id: Technique;
  title: string;
  detail: string;
}> = [
  {
    id: "display",
    title: "display: none",
    detail: "Está no DOM, mas não ocupa espaço.",
  },
  {
    id: "visibility",
    title: "visibility: hidden",
    detail: "Está no DOM e ocupa espaço, mas é invisível.",
  },
  {
    id: "opacity",
    title: "opacity: 0",
    detail: "Transparente, mas ocupa espaço e recebe clique.",
  },
  {
    id: "hidden-attr",
    title: "Atributo hidden",
    detail: "Oculto pelo atributo HTML hidden.",
  },
  {
    id: "removed",
    title: "Removida do DOM",
    detail: "O elemento não existe na página.",
  },
];

const BOX =
  "flex h-12 w-full items-center justify-center rounded-lg bg-primary/10 px-2 text-center text-sm font-medium text-primary";

// Desafio 2 de assertions: todas as caixas começam ocultas, cada uma por uma
// técnica diferente. A última nem existe no DOM.
export function VisibilityChallenge() {
  const [shown, setShown] = useState<Record<Technique, boolean>>({
    display: false,
    visibility: false,
    opacity: false,
    "hidden-attr": false,
    removed: false,
  });

  function renderBox(id: Technique) {
    const visible = shown[id];
    const common = {
      id: `box-${id}`,
      "data-hidden-by": id,
      "data-shown": visible,
    };
    const label = `Caixa: ${BOXES.find((box) => box.id === id)?.title}`;

    switch (id) {
      case "display":
        return (
          <div {...common} className={BOX} style={{ display: visible ? "flex" : "none" }}>
            {label}
          </div>
        );
      case "visibility":
        return (
          <div
            {...common}
            className={BOX}
            style={{ visibility: visible ? "visible" : "hidden" }}
          >
            {label}
          </div>
        );
      case "opacity":
        return (
          <div {...common} className={BOX} style={{ opacity: visible ? 1 : 0 }}>
            {label}
          </div>
        );
      case "hidden-attr":
        return (
          <div {...common} className={BOX} hidden={!visible}>
            {label}
          </div>
        );
      case "removed":
        // Renderização condicional: oculta, a caixa não vai para o DOM.
        return visible ? (
          <div {...common} className={BOX}>
            {label}
          </div>
        ) : null;
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Panel
          title="Sempre visível"
          description="Referência para comparar com as outras."
        >
          <div id="box-visible" className={BOX}>
            Caixa: sempre visível
          </div>
        </Panel>

        {BOXES.map((box) => (
          <Panel key={box.id} title={box.title} description={box.detail}>
            {/* Altura fixa: a página não "pula" quando a caixa aparece. */}
            <div id={`slot-${box.id}`} className="h-12">
              {renderBox(box.id)}
            </div>
            <button
              id={`toggle-${box.id}`}
              type="button"
              aria-pressed={shown[box.id]}
              className={`${ui.button} ${ui.outline} mt-3`}
              onClick={() => setShown({ ...shown, [box.id]: !shown[box.id] })}
            >
              {shown[box.id] ? "Ocultar" : "Mostrar"}
            </button>
          </Panel>
        ))}
      </div>

      <Panel
        title="Só para leitores de tela"
        description="O texto abaixo existe no DOM, mas fica fora da área visível."
      >
        <p className="text-sm">
          Pedido enviado
          <span id="sr-only-text" className="sr-only">
            {" "}
            (status atualizado em 12/03/2025)
          </span>
          .
        </p>
      </Panel>
    </div>
  );
}
