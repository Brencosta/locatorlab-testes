"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTaskAction, updateTaskAction } from "@/actions/tasks";
import { FormAlert } from "@/components/shared/form-alert";
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/components/shared/form-fields";
import { SubmitButton } from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { applyFieldErrors } from "@/lib/form-errors";
import { notify } from "@/lib/notify";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/task-labels";
import type { TaskDTO } from "@/lib/tasks";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  taskFormSchema,
  type TaskFormValues,
} from "@/lib/validations/task";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Tarefa em edição; sem ela o formulário cria uma nova. */
  task?: TaskDTO | null;
};

export function TaskFormDialog({ open, onOpenChange, task }: Props) {
  const editing = Boolean(task);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="task-form-dialog">
        <DialogHeader>
          <DialogTitle data-testid="task-form-title">
            {editing ? "Editar tarefa" : "Nova tarefa"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Altere os dados e salve para atualizar a tarefa."
              : "Preencha os dados para criar uma tarefa."}
          </DialogDescription>
        </DialogHeader>
        {/* O conteúdo só existe com o diálogo aberto: o formulário sempre
            começa com os valores atuais da tarefa. */}
        <TaskForm task={task ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TaskForm({
  task,
  onDone,
}: {
  task: TaskDTO | null;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "PENDING",
      priority: task?.priority ?? "MEDIUM",
      dueDate: task?.dueDate ?? "",
    },
  });

  function onSubmit(values: TaskFormValues) {
    setFormError(null);
    startTransition(async () => {
      const result = task
        ? await updateTaskAction(task.id, values)
        : await createTaskAction(values);

      if (result.success) {
        notify.success(result.message);
        onDone();
        return;
      }

      if (!applyFieldErrors(result, setError)) setFormError(result.message);
      notify.error(result.message);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={task ? "Formulário de edição de tarefa" : "Formulário de nova tarefa"}
      className="grid gap-4"
      data-testid="task-form"
    >
      <FormAlert message={formError} testId="task-form-error-message" />

      <TextField
        id="title"
        label="Título"
        placeholder="Ex.: Estudar seletores CSS"
        maxLength={120}
        testId="task-title"
        error={errors.title?.message}
        {...register("title")}
      />

      <TextareaField
        id="description"
        label="Descrição (opcional)"
        placeholder="Detalhes da tarefa"
        rows={3}
        testId="task-description"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          id="status"
          label="Status"
          testId="task-status"
          error={errors.status?.message}
          {...register("status")}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="priority"
          label="Prioridade"
          testId="task-priority"
          error={errors.priority?.message}
          {...register("priority")}
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </SelectField>

        <TextField
          id="dueDate"
          label="Prazo"
          type="date"
          testId="task-due-date"
          error={errors.dueDate?.message}
          {...register("dueDate")}
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={pending}
          data-testid="task-form-cancel-button"
        >
          Cancelar
        </Button>
        <SubmitButton
          pending={pending}
          pendingLabel="Salvando..."
          data-testid="task-form-submit-button"
        >
          {task ? "Salvar alterações" : "Criar tarefa"}
        </SubmitButton>
      </DialogFooter>
    </form>
  );
}
