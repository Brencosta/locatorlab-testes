"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { deleteTaskAction } from "@/actions/tasks";
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
import { notify } from "@/lib/notify";
import type { TaskDTO } from "@/lib/tasks";

export function DeleteTaskDialog({
  task,
  onClose,
}: {
  /** Tarefa a excluir; null mantém o diálogo fechado. */
  task: TaskDTO | null;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!task) return;
    startTransition(async () => {
      const result = await deleteTaskAction(task.id);
      notify.result(result);
      onClose();
    });
  }

  return (
    <AlertDialog
      open={task !== null}
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <AlertDialogContent data-testid="delete-task-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
          <AlertDialogDescription>
            A tarefa{" "}
            <strong
              className="font-medium text-foreground"
              data-testid="delete-task-title"
            >
              {task?.title}
            </strong>{" "}
            será excluída permanentemente. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={pending}
            data-testid="delete-task-cancel-button"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            aria-busy={pending}
            onClick={handleDelete}
            data-testid="delete-task-confirm-button"
          >
            {pending ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : null}
            {pending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
