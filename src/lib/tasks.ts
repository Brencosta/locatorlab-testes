import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaginationMeta } from "@/lib/api-response";
import { todayISO } from "@/lib/utils";
import type {
  TaskInput,
  TaskPatch,
  TaskPriority,
  TaskQuery,
  TaskSort,
  TaskStatus,
} from "@/lib/validations/task";

/** Quem está agindo: aluno só enxerga as próprias tarefas; admin, todas. */
export type Actor = { id: string; role: "STUDENT" | "ADMIN" };

export type TaskDTO = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; name: string };
};

export type TaskResult =
  | { ok: true; task: TaskDTO }
  | { ok: false; reason: "NOT_FOUND" | "FORBIDDEN" };

const taskInclude = {
  user: { select: { id: true, name: true } },
} satisfies Prisma.TaskInclude;

type TaskRow = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

function toDTO(row: TaskRow): TaskDTO {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ? row.dueDate.toISOString().slice(0, 10) : null,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    owner: row.user,
  };
}

function scopeFor(actor: Actor): Prisma.TaskWhereInput {
  return actor.role === "ADMIN" ? {} : { userId: actor.id };
}

function toDate(value: string | null | undefined) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

const ORDER_BY: Record<TaskSort, Prisma.TaskOrderByWithRelationInput[]> = {
  newest: [{ createdAt: "desc" }, { id: "desc" }],
  oldest: [{ createdAt: "asc" }, { id: "asc" }],
  dueDate: [{ dueDate: { sort: "asc", nulls: "last" } }, { id: "asc" }],
  title: [{ title: "asc" }, { id: "asc" }],
  priority: [{ priority: "desc" }, { id: "desc" }],
};

export async function listTasks(
  actor: Actor,
  query: TaskQuery,
): Promise<{ items: TaskDTO[]; meta: PaginationMeta }> {
  const where: Prisma.TaskWhereInput = {
    ...scopeFor(actor),
    ...(query.status ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: ORDER_BY[query.sort],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  return {
    items: rows.map(toDTO),
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    },
  };
}

async function findAccessible(
  actor: Actor,
  id: number,
): Promise<
  { ok: true; row: TaskRow } | { ok: false; reason: "NOT_FOUND" | "FORBIDDEN" }
> {
  if (!Number.isSafeInteger(id) || id < 1) {
    return { ok: false, reason: "NOT_FOUND" };
  }
  const row = await prisma.task.findUnique({
    where: { id },
    include: taskInclude,
  });
  if (!row) return { ok: false, reason: "NOT_FOUND" };
  if (actor.role !== "ADMIN" && row.userId !== actor.id) {
    return { ok: false, reason: "FORBIDDEN" };
  }
  return { ok: true, row };
}

export async function getTask(actor: Actor, id: number): Promise<TaskResult> {
  const found = await findAccessible(actor, id);
  return found.ok ? { ok: true, task: toDTO(found.row) } : found;
}

export async function createTask(
  actor: Actor,
  input: TaskInput,
): Promise<TaskDTO> {
  const status = input.status ?? "PENDING";
  const row = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description || null,
      status,
      priority: input.priority ?? "MEDIUM",
      dueDate: toDate(input.dueDate),
      completedAt: status === "DONE" ? new Date() : null,
      userId: actor.id,
    },
    include: taskInclude,
  });
  return toDTO(row);
}

/** Atualização parcial: campos `undefined` não são alterados. */
export async function updateTask(
  actor: Actor,
  id: number,
  patch: TaskPatch,
): Promise<TaskResult> {
  const found = await findAccessible(actor, id);
  if (!found.ok) return found;

  const data: Prisma.TaskUpdateInput = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.description !== undefined) {
    data.description = patch.description || null;
  }
  if (patch.priority !== undefined) data.priority = patch.priority;
  if (patch.dueDate !== undefined) data.dueDate = toDate(patch.dueDate);
  if (patch.status !== undefined) {
    data.status = patch.status;
    if (patch.status !== "DONE") {
      data.completedAt = null;
    } else if (found.row.status !== "DONE") {
      data.completedAt = new Date();
    }
  }

  const row = await prisma.task.update({
    where: { id },
    data,
    include: taskInclude,
  });
  return { ok: true, task: toDTO(row) };
}

export async function deleteTask(actor: Actor, id: number): Promise<TaskResult> {
  const found = await findAccessible(actor, id);
  if (!found.ok) return found;
  await prisma.task.delete({ where: { id } });
  return { ok: true, task: toDTO(found.row) };
}

export type TaskStats = {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
  overdue: number;
  completionRate: number;
  openByPriority: Record<TaskPriority, number>;
  recent: TaskDTO[];
  upcoming: TaskDTO[];
};

export async function getTaskStats(actor: Actor): Promise<TaskStats> {
  const scope = scopeFor(actor);
  const today = toDate(todayISO())!;
  const open: Prisma.TaskWhereInput = { ...scope, status: { not: "DONE" } };

  const [byStatus, byPriority, overdue, recent, upcoming] = await Promise.all([
    prisma.task.groupBy({ by: ["status"], where: scope, _count: { _all: true } }),
    prisma.task.groupBy({ by: ["priority"], where: open, _count: { _all: true } }),
    prisma.task.count({ where: { ...open, dueDate: { lt: today } } }),
    prisma.task.findMany({
      where: scope,
      include: taskInclude,
      orderBy: ORDER_BY.newest,
      take: 5,
    }),
    prisma.task.findMany({
      where: { ...open, dueDate: { gte: today } },
      include: taskInclude,
      orderBy: ORDER_BY.dueDate,
      take: 5,
    }),
  ]);

  const statusCount = (status: TaskStatus) =>
    byStatus.find((group) => group.status === status)?._count._all ?? 0;
  const priorityCount = (priority: TaskPriority) =>
    byPriority.find((group) => group.priority === priority)?._count._all ?? 0;

  const pending = statusCount("PENDING");
  const inProgress = statusCount("IN_PROGRESS");
  const done = statusCount("DONE");
  const total = pending + inProgress + done;

  return {
    total,
    pending,
    inProgress,
    done,
    overdue,
    completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
    openByPriority: {
      HIGH: priorityCount("HIGH"),
      MEDIUM: priorityCount("MEDIUM"),
      LOW: priorityCount("LOW"),
    },
    recent: recent.map(toDTO),
    upcoming: upcoming.map(toDTO),
  };
}
