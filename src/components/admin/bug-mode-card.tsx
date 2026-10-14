"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Bug } from "lucide-react";
import { setBugModeAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BUGS } from "@/lib/bugs/registry";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";

/** Interruptor do Modo Bug e a lista dos defeitos que ele ativa. */
export function BugModeCard({ enabled }: { enabled: boolean }) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      notify.result(await setBugModeAction(!enabled));
    });
  }

  return (
    <Card data-testid="bug-mode-card">
      <CardHeader>
        <CardTitle>
          <h2 id="bug-mode-title" className="flex items-center gap-2">
            <Bug className="size-4 text-primary" aria-hidden="true" />
            Modo Bug
          </h2>
        </CardTitle>
        <CardDescription>
          Liga defeitos propositais para todos os usuários. Os alunos não veem
          nenhum aviso de que o modo está ativo.
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                enabled ? "text-destructive" : "text-muted-foreground",
              )}
              data-testid="bug-mode-status"
              data-enabled={enabled}
            >
              {enabled ? "Ativado" : "Desativado"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-labelledby="bug-mode-title"
              aria-busy={pending}
              disabled={pending}
              onClick={toggle}
              data-testid="bug-mode-switch"
              className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full bg-input transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-60 aria-checked:bg-destructive"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow transition-transform",
                  enabled && "translate-x-5",
                )}
              />
            </button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3" data-testid="bug-list">
          {BUGS.map((bug, index) => {
            const active = enabled && bug.enabled;
            return (
              <li
                key={bug.id}
                className="flex gap-3 rounded-lg border p-3"
                data-testid={`bug-item-${bug.id}`}
                data-active={active}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium">{bug.title}</h3>
                    <Badge
                      variant={active ? "destructive" : "outline"}
                      className={active ? "" : "text-muted-foreground"}
                    >
                      {active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {bug.description}
                  </p>
                  <Link
                    href={bug.href}
                    className="inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {bug.where}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
