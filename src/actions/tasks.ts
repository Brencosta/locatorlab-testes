"use server";

import { revalidatePath } from "next/cache";
import {
  SESSION_EXPIRED,
  UNEXPECTED_ERROR,
  validationFailure,
  type ActionResult,
} from "@/lib/action-result";
import { getCurrentUser } from "@/lib/session";
import { createTask, deleteTask, updateTask, type TaskResult } from "@/lib/tasks";
import { taskFormSchema } from "@/lib/validations/task";

function revalidateTaskPages() {
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

function accessFailure(result: Extract<TaskResult, { ok: false }>): ActionResult {
  return {
    success: false,
    message:
      result.reason === "FORBIDDEN"
        ? "Você não tem permissão para alterar esta tarefa."
        : "Tarefa não encontrada. Ela pode ter sido excluída.",
  };
}

export async function createTaskAction(values: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  const parsed = taskFormSchema.safeParse(values);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await createTask(user, parsed.data);
    revalidateTaskPages();
    return { success: true, message: "Tarefa criada com sucesso." };
  } catch (error) {
    console.error("[createTaskAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function updateTaskAction(
  id: number,
  values: unknown,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  const parsed = taskFormSchema.safeParse(values);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    const result = await updateTask(user, id, parsed.data);
    if (!result.ok) return accessFailure(result);
    revalidateTaskPages();
    return { success: true, message: "Tarefa atualizada com sucesso." };
  } catch (error) {
    console.error("[updateTaskAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function toggleTaskDoneAction(
  id: number,
  done: boolean,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  try {
    const result = await updateTask(user, id, {
      status: done ? "DONE" : "PENDING",
    });
    if (!result.ok) return accessFailure(result);
    revalidateTaskPages();
    return {
      success: true,
      message: done ? "Tarefa concluída." : "Tarefa reaberta.",
    };
  } catch (error) {
    console.error("[toggleTaskDoneAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function deleteTaskAction(id: number): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  try {
    const result = await deleteTask(user, id);
    if (!result.ok) return accessFailure(result);
    revalidateTaskPages();
    return { success: true, message: "Tarefa excluída com sucesso." };
  } catch (error) {
    console.error("[deleteTaskAction]", error);
    return UNEXPECTED_ERROR;
  }
}
