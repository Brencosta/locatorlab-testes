"use client";

import { useState, useTransition } from "react";
import { DatabaseBackup, Loader2 } from "lucide-react";
import { resetDatabaseAction } from "@/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notify } from "@/lib/notify";

/** Botão que restaura o banco ao estado do seed, com confirmação. */
export function ResetDatabaseCard() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleReset() {
    startTransition(async () => {
      notify.result(await resetDatabaseAction());
      setOpen(false);
    });
  }

  return (
    <Card data-testid="reset-database-card">
      <CardHeader>
        <CardTitle>
          <h2 className="flex items-center gap-2">
            <DatabaseBackup className="size-4 text-primary" aria-hidden="true" />
            Restaurar banco de dados
          </h2>
        </CardTitle>
        <CardDescription>
          Volta usuários e tarefas ao estado do seed. Útil antes de cada aula.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="grid list-disc gap-1 pl-5 text-sm text-muted-foreground">
          <li>Apaga as contas criadas pelos alunos, as tarefas e os avatares.</li>
          <li>Recria o aluno e o admin de teste e as 30 tarefas iniciais.</li>
          <li>Mantém o Modo Bug como está.</li>
        </ul>
        <Button
          variant="destructive"
          onClick={() => setOpen(true)}
          data-testid="reset-database-button"
        >
          Restaurar banco
        </Button>
      </CardContent>

      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!pending) setOpen(next);
        }}
      >
        <AlertDialogContent data-testid="reset-database-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar o banco de dados?</AlertDialogTitle>
            <AlertDialogDescription>
              Todas as contas criadas pelos alunos, as tarefas e os avatares
              serão apagados, e os dados do seed serão recriados. Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={pending}
              data-testid="reset-database-cancel-button"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              aria-busy={pending}
              onClick={handleReset}
              data-testid="reset-database-confirm-button"
            >
              {pending ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : null}
              {pending ? "Restaurando..." : "Sim, restaurar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
