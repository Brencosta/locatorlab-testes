"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Bloco de código com botão de copiar. */
export function CodeBlock({
  code,
  label,
  testId,
}: {
  code: string;
  /** Descrição do conteúdo, usada nos rótulos de acessibilidade. */
  label: string;
  testId: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Sem permissão para a área de transferência: o texto pode ser
      // selecionado e copiado manualmente.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative min-w-0">
      {/* tabIndex: permite rolar o bloco pelo teclado quando ele é mais largo que a tela. */}
      <pre
        tabIndex={0}
        aria-label={label}
        data-testid={testId}
        className="max-h-96 overflow-auto rounded-lg bg-muted/60 p-3 pr-11 font-mono text-xs leading-relaxed outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label}: copiado` : `Copiar ${label.toLowerCase()}`}
        data-testid={`${testId}-copy`}
        data-copied={copied}
        className="absolute top-1.5 right-1.5 flex size-7 cursor-pointer items-center justify-center rounded-md bg-background/80 text-muted-foreground ring-1 ring-foreground/10 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {copied ? (
          <Check className="size-3.5 text-success" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>
      <span className="sr-only" role="status">
        {copied ? "Copiado para a área de transferência." : ""}
      </span>
    </div>
  );
}
