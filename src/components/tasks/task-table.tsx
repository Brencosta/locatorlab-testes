"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toggleTaskDoneAction } from "@/actions/tasks";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { PriorityBadge, StatusBadge } from "@/components/tasks/task-badges";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { notify } from "@/lib/notify";
import type { TaskDTO } from "@/lib/tasks";
import { cn, formatDate, isOverdue } from "@/lib/utils";

export function TaskTable({
  tasks,
  showOwner,
}: {
  tasks: TaskDTO[];
  /** Admin enxerga tarefas de todos, então mostramos o responsável. */
  showOwner: boolean;
}) {
  const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskDTO | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(task: TaskDTO, done: boolean) {
    setTogglingId(task.id);
    startTransition(async () => {
      const result = await toggleTaskDoneAction(task.id, done);
      notify.result(result);
      setTogglingId(null);
    });
  }

  return (
    <>
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <Table aria-label="Lista de tarefas" data-testid="tasks-table">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <span className="sr-only">Concluída</span>
              </TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Prazo</TableHead>
              {showOwner ? <TableHead>Responsável</TableHead> : null}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const done = task.status === "DONE";
              const overdue = isOverdue(task);

              return (
                <TableRow
                  key={task.id}
                  data-testid={`task-row-${task.id}`}
                  data-task-id={task.id}
                  data-status={task.status}
                  data-priority={task.priority}
                >
                  <TableCell>
                    <Checkbox
                      checked={done}
                      disabled={togglingId === task.id}
                      onCheckedChange={(checked) =>
                        handleToggle(task, checked === true)
                      }
                      aria-label={
                        done
                          ? `Reabrir a tarefa: ${task.title}`
                          : `Marcar como concluída: ${task.title}`
                      }
                      data-testid={`task-done-checkbox-${task.id}`}
                    />
                  </TableCell>
                  <TableCell className="max-w-xs min-w-48 whitespace-normal">
                    <span
                      className={cn(
                        "block font-medium",
                        done && "text-muted-foreground line-through",
                      )}
                      data-testid={`task-title-${task.id}`}
                    >
                      {task.title}
                    </span>
                    {task.description ? (
                      <span
                        className="line-clamp-1 text-xs text-muted-foreground"
                        data-testid={`task-description-${task.id}`}
                      >
                        {task.description}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={task.status}
                      testId={`task-status-badge-${task.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge
                      priority={task.priority}
                      testId={`task-priority-badge-${task.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "tabular-nums",
                        overdue && "font-medium text-destructive",
                      )}
                      data-testid={`task-due-date-${task.id}`}
                      data-overdue={overdue}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                    {overdue ? (
                      <span className="block text-xs text-destructive">
                        Atrasada
                      </span>
                    ) : null}
                  </TableCell>
                  {showOwner ? (
                    <TableCell data-testid={`task-owner-${task.id}`}>
                      {task.owner.name}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar a tarefa: ${task.title}`}
                        title="Editar"
                        onClick={() => setEditingTask(task)}
                        data-testid={`task-edit-button-${task.id}`}
                      >
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Excluir a tarefa: ${task.title}`}
                        title="Excluir"
                        onClick={() => setDeletingTask(task)}
                        data-testid={`task-delete-button-${task.id}`}
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <TaskFormDialog
        open={editingTask !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
      />
      <DeleteTaskDialog
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
      />
    </>
  );
}
