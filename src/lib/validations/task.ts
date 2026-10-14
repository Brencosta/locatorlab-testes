import { z } from "zod";

export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const TASK_SORTS = [
  "newest",
  "oldest",
  "dueDate",
  "title",
  "priority",
] as const;
export const TASK_PAGE_SIZES = [5, 10, 20] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskSort = (typeof TASK_SORTS)[number];

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

const titleField = z
  .string({ error: "Informe o título." })
  .trim()
  .min(1, "Informe o título.")
  .min(3, "O título deve ter pelo menos 3 caracteres.")
  .max(100, "O título deve ter no máximo 100 caracteres.");

const descriptionField = z
  .string({ error: "Descrição inválida." })
  .trim()
  .max(500, "A descrição deve ter no máximo 500 caracteres.");

const statusField = z.enum(TASK_STATUSES, {
  error: "Status inválido. Use PENDING, IN_PROGRESS ou DONE.",
});

const priorityField = z.enum(TASK_PRIORITIES, {
  error: "Prioridade inválida. Use LOW, MEDIUM ou HIGH.",
});

const dueDateField = z
  .string({ error: "Data inválida. Use o formato AAAA-MM-DD." })
  .refine((value) => value === "" || isValidDateString(value), {
    message: "Data inválida. Use o formato AAAA-MM-DD.",
  });

/** Formulário da interface: todos os campos são strings preenchidas. */
export const taskFormSchema = z.object({
  title: titleField,
  description: descriptionField,
  status: statusField,
  priority: priorityField,
  dueDate: dueDateField,
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

/** API (POST e PUT): só o título é obrigatório. */
export const taskCreateSchema = z.object({
  title: titleField,
  description: descriptionField.nullish(),
  status: statusField.optional(),
  priority: priorityField.optional(),
  dueDate: dueDateField.nullish(),
});

/** API (PATCH): qualquer subconjunto dos campos, pelo menos um. */
export const taskPatchSchema = taskCreateSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Envie pelo menos um campo para atualizar.",
  });

export type TaskInput = z.infer<typeof taskCreateSchema>;
export type TaskPatch = Partial<TaskInput>;

export const taskQuerySchema = z.object({
  page: z.coerce
    .number({ error: "page deve ser um número inteiro." })
    .int("page deve ser um número inteiro.")
    .min(1, "page deve ser maior ou igual a 1.")
    .default(1),
  pageSize: z.coerce
    .number({ error: "pageSize deve ser um número inteiro." })
    .int("pageSize deve ser um número inteiro.")
    .min(1, "pageSize deve ser maior ou igual a 1.")
    .max(50, "pageSize deve ser no máximo 50.")
    .default(10),
  search: z
    .string()
    .trim()
    .max(100, "search deve ter no máximo 100 caracteres.")
    .default(""),
  status: statusField.optional(),
  priority: priorityField.optional(),
  sort: z
    .enum(TASK_SORTS, {
      error: "sort inválido. Use newest, oldest, dueDate, title ou priority.",
    })
    .default("newest"),
});

export type TaskQuery = z.infer<typeof taskQuerySchema>;

export const DEFAULT_TASK_QUERY: TaskQuery = taskQuerySchema.parse({});

/**
 * Valida parâmetros de busca vindos da URL.
 * Valores vazios ("status=") são tratados como ausentes.
 */
export function parseTaskQuery(
  raw: Record<string, string | string[] | undefined>,
) {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    const single = Array.isArray(value) ? value[0] : value;
    if (single !== undefined && single.trim() !== "") cleaned[key] = single;
  }
  return taskQuerySchema.safeParse(cleaned);
}

/** Monta a URL da página de tarefas omitindo os valores padrão. */
export function buildTasksHref(
  query: TaskQuery,
  overrides: Partial<TaskQuery> = {},
) {
  const next = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (next.search) params.set("search", next.search);
  if (next.status) params.set("status", next.status);
  if (next.priority) params.set("priority", next.priority);
  if (next.sort !== DEFAULT_TASK_QUERY.sort) params.set("sort", next.sort);
  if (next.pageSize !== DEFAULT_TASK_QUERY.pageSize) {
    params.set("pageSize", String(next.pageSize));
  }
  if (next.page > 1) params.set("page", String(next.page));
  const queryString = params.toString();
  return queryString ? `/tasks?${queryString}` : "/tasks";
}
