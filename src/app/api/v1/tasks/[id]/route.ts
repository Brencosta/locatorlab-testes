import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import {
  forbidden,
  noContent,
  notFound,
  ok,
  readJsonBody,
  unauthorized,
  validationError,
  withApi,
} from "@/lib/api-response";
import { deleteTask, getTask, updateTask, type TaskResult } from "@/lib/tasks";
import { taskCreateSchema, taskPatchSchema } from "@/lib/validations/task";

type Context = { params: Promise<{ id: string }> };

// "12" -> 12; qualquer outra coisa -> NaN (tratado como 404).
async function readId(context: Context) {
  const { id } = await context.params;
  return /^\d+$/.test(id) ? Number(id) : Number.NaN;
}

function accessError(result: Extract<TaskResult, { ok: false }>) {
  return result.reason === "FORBIDDEN"
    ? forbidden("Esta tarefa pertence a outro usuário.")
    : notFound("Tarefa não encontrada.");
}

function revalidateTaskPages() {
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

// GET /api/v1/tasks/:id
export const GET = withApi(async (request: NextRequest, context: Context) => {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const result = await getTask(user, await readId(context));
  return result.ok ? ok(result.task) : accessError(result);
});

// PUT /api/v1/tasks/:id - substitui a tarefa inteira.
// Campos opcionais não enviados voltam para o valor padrão.
export const PUT = withApi(async (request: NextRequest, context: Context) => {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const json = await readJsonBody(request);
  if (!json.ok) return json.response;

  const parsed = taskCreateSchema.safeParse(json.body);
  if (!parsed.success) return validationError(parsed.error);

  const result = await updateTask(user, await readId(context), {
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    status: parsed.data.status ?? "PENDING",
    priority: parsed.data.priority ?? "MEDIUM",
    dueDate: parsed.data.dueDate ?? null,
  });
  if (!result.ok) return accessError(result);

  revalidateTaskPages();
  return ok(result.task);
});

// PATCH /api/v1/tasks/:id - altera só os campos enviados.
export const PATCH = withApi(async (request: NextRequest, context: Context) => {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const json = await readJsonBody(request);
  if (!json.ok) return json.response;

  const parsed = taskPatchSchema.safeParse(json.body);
  if (!parsed.success) return validationError(parsed.error);

  const result = await updateTask(user, await readId(context), parsed.data);
  if (!result.ok) return accessError(result);

  revalidateTaskPages();
  return ok(result.task);
});

// DELETE /api/v1/tasks/:id
export const DELETE = withApi(async (request: NextRequest, context: Context) => {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const result = await deleteTask(user, await readId(context));
  if (!result.ok) return accessError(result);

  revalidateTaskPages();
  return noContent();
});
