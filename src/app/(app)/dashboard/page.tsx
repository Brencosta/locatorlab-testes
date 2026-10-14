import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CircleCheckBig,
  CircleDashed,
  ClipboardList,
  ListTodo,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TaskListCard } from "@/components/dashboard/task-list-card";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/states";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { PRIORITY_LABELS } from "@/lib/task-labels";
import { getTaskStats } from "@/lib/tasks";
import { firstName } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stats = await getTaskStats(user);
  const isAdmin = user.role === "ADMIN";
  const openTotal = stats.pending + stats.inProgress;

  return (
    <>
      <PageHeader
        title={
          <>
            Olá,{" "}
            <span data-testid="dashboard-user-name">{firstName(user.name)}</span>!
          </>
        }
        description={
          isAdmin
            ? "Visão geral das tarefas de todos os usuários."
            : "Aqui está o resumo das suas tarefas."
        }
        actions={
          <Link
            href="/tasks"
            className={buttonVariants()}
            data-testid="dashboard-tasks-link"
          >
            <ListTodo aria-hidden="true" />
            Ver tarefas
          </Link>
        }
      />

      <FadeIn>
        <section
          aria-label="Contadores de tarefas"
          className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5"
          data-testid="dashboard-stats"
        >
          <StatCard
            label="Total"
            value={stats.total}
            icon={ClipboardList}
            tone="primary"
            href="/tasks"
            testId="dashboard-stat-total"
          />
          <StatCard
            label="Pendentes"
            value={stats.pending}
            icon={CircleDashed}
            tone="warning"
            href="/tasks?status=PENDING"
            testId="dashboard-stat-pending"
          />
          <StatCard
            label="Em andamento"
            value={stats.inProgress}
            icon={Timer}
            tone="info"
            href="/tasks?status=IN_PROGRESS"
            testId="dashboard-stat-in-progress"
          />
          <StatCard
            label="Concluídas"
            value={stats.done}
            icon={CircleCheckBig}
            tone="success"
            href="/tasks?status=DONE"
            testId="dashboard-stat-done"
          />
          <StatCard
            label="Atrasadas"
            value={stats.overdue}
            icon={TriangleAlert}
            tone="destructive"
            href="/tasks?sort=dueDate"
            testId="dashboard-stat-overdue"
          />
        </section>
      </FadeIn>

      {stats.total === 0 ? (
        <EmptyState
          className="mt-6"
          testId="dashboard-empty-state"
          icon={ClipboardList}
          title="Você ainda não tem tarefas"
          description="Crie sua primeira tarefa para ver o resumo aparecer aqui."
          action={
            <Link
              href="/tasks"
              className={buttonVariants()}
              data-testid="dashboard-empty-create-link"
            >
              Criar tarefa
            </Link>
          }
        />
      ) : (
        <FadeIn delay={0.05} className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card data-testid="dashboard-progress-card">
            <CardHeader>
              <CardTitle>
                <h2>Progresso geral</h2>
              </CardTitle>
              <CardDescription>
                {stats.done} de {stats.total} tarefas concluídas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span
                  className="text-3xl font-semibold tabular-nums"
                  data-testid="dashboard-progress-value"
                >
                  {stats.completionRate}%
                </span>
                <span className="text-sm text-muted-foreground">concluído</span>
              </div>
              <div
                role="progressbar"
                aria-label="Percentual de tarefas concluídas"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={stats.completionRate}
                className="h-2 overflow-hidden rounded-full bg-muted"
                data-testid="dashboard-progress-bar"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="dashboard-priority-card">
            <CardHeader>
              <CardTitle>
                <h2>Em aberto por prioridade</h2>
              </CardTitle>
              <CardDescription>
                {openTotal} {openTotal === 1 ? "tarefa" : "tarefas"} ainda não
                {openTotal === 1 ? " concluída" : " concluídas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-3 text-center">
                {(["HIGH", "MEDIUM", "LOW"] as const).map((priority) => (
                  <div key={priority} className="rounded-lg bg-muted/50 p-3">
                    <dt className="text-xs text-muted-foreground">
                      {PRIORITY_LABELS[priority]}
                    </dt>
                    <dd
                      className="text-xl font-semibold tabular-nums"
                      data-testid={`dashboard-priority-${priority.toLowerCase()}`}
                    >
                      {stats.openByPriority[priority]}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <TaskListCard
            testId="dashboard-recent-tasks"
            title="Tarefas recentes"
            description="As últimas 5 tarefas criadas"
            tasks={stats.recent}
            emptyMessage="Nenhuma tarefa criada ainda."
          />

          <TaskListCard
            testId="dashboard-upcoming-tasks"
            title="Próximos prazos"
            description="Tarefas em aberto com prazo mais próximo"
            tasks={stats.upcoming}
            emptyMessage="Nenhuma tarefa com prazo futuro."
            showDueDate
          />
        </FadeIn>
      )}
    </>
  );
}
