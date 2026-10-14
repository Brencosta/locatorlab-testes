import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type StateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  testId: string;
  className?: string;
  /**
   * Nível do título. Use "h1" quando o estado ocupa a página inteira (404,
   * acesso negado, erro) e não há outro título principal.
   */
  heading?: "h1" | "h2";
};

function StateBox({
  title,
  description,
  icon: Icon,
  action,
  testId,
  className,
  heading: Heading = "h2",
  tone = "muted",
  role,
  children,
}: StateProps & {
  tone?: "muted" | "destructive" | "primary";
  role?: "status" | "alert";
  children?: React.ReactNode;
}) {
  return (
    <div
      role={role}
      data-testid={testId}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full",
            tone === "muted" && "bg-muted text-muted-foreground",
            tone === "destructive" && "bg-destructive/10 text-destructive",
            tone === "primary" && "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </div>
      ) : null}
      <div className="space-y-1">
        <Heading className="text-base font-semibold" data-testid={`${testId}-title`}>
          {title}
        </Heading>
        {description ? (
          <p
            className="mx-auto max-w-md text-sm text-muted-foreground"
            data-testid={`${testId}-description`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children}
      {action}
    </div>
  );
}

/** Lista sem itens. */
export function EmptyState({ icon = Inbox, ...props }: StateProps) {
  return <StateBox role="status" icon={icon} {...props} />;
}

/** Falha ao carregar. */
export function ErrorState({ icon = AlertTriangle, ...props }: StateProps) {
  return <StateBox role="alert" tone="destructive" icon={icon} {...props} />;
}

/** Usuário logado sem permissão para a página. */
export function AccessDenied({
  title = "Acesso negado",
  description = "Esta área é exclusiva para administradores.",
  action,
}: Partial<Pick<StateProps, "title" | "description" | "action">>) {
  return (
    <StateBox
      role="alert"
      tone="destructive"
      icon={Lock}
      title={title}
      description={description}
      action={action}
      testId="access-denied"
      heading="h1"
    />
  );
}
