import { ChevronDown, Lightbulb } from "lucide-react";

// "texto com `código`" -> texto com <code>código</code>
function renderInline(text: string) {
  return text.split(/`([^`]+)`/).map((part, index) =>
    index % 2 === 1 ? (
      <code
        key={index}
        className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em] break-words"
      >
        {part}
      </code>
    ) : (
      part
    ),
  );
}

/** Bloco "Dica" recolhível (fechado por padrão). */
export function ChallengeHint({ hints }: { hints: string[] }) {
  return (
    <details
      className="group rounded-xl bg-card ring-1 ring-foreground/10"
      data-testid="challenge-hint"
    >
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden"
        data-testid="challenge-hint-toggle"
      >
        <Lightbulb className="size-4 text-warning" aria-hidden="true" />
        Dica
        <span className="font-normal text-muted-foreground">
          (abra se travar)
        </span>
        <ChevronDown
          className="ml-auto size-4 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul
        className="grid gap-2 border-t px-4 py-3 text-sm leading-relaxed"
        data-testid="challenge-hint-content"
      >
        {hints.map((hint) => (
          <li key={hint} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-warning"
            />
            <span className="min-w-0">{renderInline(hint)}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
