import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Clock, Inbox, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  testId: string;
  className?: string;
};

function StateBox({
  title,
  description,
  icon: Icon,
  action,
  testId,
  className,
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
        <h2 className="text-base font-semibold" data-testid={`${testId}-title`}>
          {title}
        </h2>
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
    />
  );
}

/** Página de uma área que chega nas próximas etapas. */
export function ComingSoon({
  title,
  description,
  icon = Clock,
  features,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  features: string[];
}) {
  return (
    <StateBox
      tone="primary"
      icon={icon}
      title={title}
      description={description}
      testId="coming-soon"
      className="py-16"
    >
      <Badge variant="secondary" data-testid="coming-soon-badge">
        Em breve
      </Badge>
      <ul
        className="mt-2 grid gap-2 text-left text-sm text-muted-foreground"
        aria-label="O que está planejado"
        data-testid="coming-soon-features"
      >
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
            />
            {feature}
          </li>
        ))}
      </ul>
    </StateBox>
  );
}
