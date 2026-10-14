import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList, SearchX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/states";
import { TaskCreateButton } from "@/components/tasks/task-create-button";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskPagination } from "@/components/tasks/task-pagination";
import { TaskTable } from "@/components/tasks/task-table";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { listTasks } from "@/lib/tasks";
import {
  buildTasksHref,
  DEFAULT_TASK_QUERY,
  parseTaskQuery,
} from "@/lib/validations/task";

export const metadata: Metadata = { title: "Tarefas" };

export default async function TasksPage({ searchParams }: PageProps<"/tasks">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Parâmetros inválidos na URL voltam para o padrão.
  const parsed = parseTaskQuery(await searchParams);
  const query = parsed.success ? parsed.data : DEFAULT_TASK_QUERY;

  const { items, meta } = await listTasks(user, query);

  // Ex.: excluiu o último item da última página.
  if (query.page > meta.totalPages) {
    redirect(buildTasksHref(query, { page: meta.totalPages }));
  }

  const isAdmin = user.role === "ADMIN";
  const hasFilters =
    query.search !== "" ||
    query.status !== undefined ||
    query.priority !== undefined;
  const firstItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1;
  const lastItem = firstItem === 0 ? 0 : firstItem + items.length - 1;

  return (
    <>
      <PageHeader
        title="Tarefas"
        description={
          isAdmin
            ? "Como admin, você vê e gerencia as tarefas de todos os usuários."
            : "Crie, edite, conclua e exclua suas tarefas."
        }
        actions={<TaskCreateButton />}
      />

      <TaskFilters query={query} />

      <p
        className="mb-3 text-sm text-muted-foreground"
        aria-live="polite"
        data-testid="tasks-count"
        data-total={meta.total}
      >
        {meta.total === 0
          ? "Nenhuma tarefa encontrada"
          : `Mostrando ${firstItem}–${lastItem} de ${meta.total} ${
              meta.total === 1 ? "tarefa" : "tarefas"
            }`}
      </p>

      {items.length > 0 ? (
        <>
          <TaskTable tasks={items} showOwner={isAdmin} />
          <TaskPagination query={query} meta={meta} />
        </>
      ) : hasFilters ? (
        <EmptyState
          testId="tasks-no-results"
          icon={SearchX}
          title="Nenhuma tarefa encontrada"
          description="Nenhuma tarefa corresponde à busca ou aos filtros aplicados."
          action={
            <Link
              href="/tasks"
              className={buttonVariants({ variant: "outline" })}
              data-testid="tasks-no-results-clear-link"
            >
              Limpar filtros
            </Link>
          }
        />
      ) : (
        <EmptyState
          testId="tasks-empty-state"
          icon={ClipboardList}
          title="Você ainda não tem tarefas"
          description="Crie a primeira tarefa para começar a praticar."
          action={<TaskCreateButton testId="tasks-empty-create-button" />}
        />
      )}
    </>
  );
}
