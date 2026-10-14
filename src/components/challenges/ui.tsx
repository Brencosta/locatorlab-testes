import { cn } from "@/lib/utils";

// Estilos compartilhados pelos desafios.
// Os desafios usam HTML puro (e não os componentes de src/components/ui) para
// que cada um controle exatamente quais atributos existem nos elementos.
export const ui = {
  input:
    "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
  button:
    "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
  primary: "bg-primary text-primary-foreground hover:bg-primary/85",
  outline: "border border-border bg-background hover:bg-muted",
  danger: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  label: "text-sm font-medium",
  hint: "text-xs text-muted-foreground",
  check: "size-4 shrink-0 accent-primary",
  tableWrap: "overflow-x-auto rounded-lg border",
  table: "w-full text-sm",
  th: "bg-muted/50 px-3 py-2 text-left text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase",
  td: "border-t px-3 py-2 align-middle",
} as const;

/** Bloco com título dentro da área de prática. */
export function Panel({
  title,
  description,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  title: string;
  description?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-xl border p-4", className)} {...props}>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Texto de resultado das ações: é o alvo das assertions. */
export function Result({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
