import Link from "next/link";
import { PriorityBadge, StatusBadge } from "@/components/tasks/task-badges";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TaskDTO } from "@/lib/tasks";
import { formatDate } from "@/lib/utils";

/** Card com uma lista curta de tarefas (recentes, próximos prazos...). */
export function TaskListCard({
  title,
  description,
  tasks,
  emptyMessage,
  showDueDate = false,
  testId,
}: {
  title: string;
  description: string;
  tasks: TaskDTO[];
  emptyMessage: string;
  showDueDate?: boolean;
  testId: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link
            href="/tasks"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            data-testid={`${testId}-view-all`}
          >
            Ver todas
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p
            role="status"
            className="py-6 text-center text-sm text-muted-foreground"
            data-testid={`${testId}-empty`}
          >
            {emptyMessage}
          </p>
        ) : (
          <ul className="divide-y" data-testid={`${testId}-list`}>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                data-testid={`${testId}-item-${task.id}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {task.title}
                  </span>
                  {showDueDate ? (
                    <span className="block text-xs text-muted-foreground">
                      Prazo: {formatDate(task.dueDate)}
                    </span>
                  ) : null}
                </span>
                {showDueDate ? (
                  <PriorityBadge priority={task.priority} />
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
