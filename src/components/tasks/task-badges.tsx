import { Badge } from "@/components/ui/badge";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/task-labels";
import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/lib/validations/task";

const STATUS_STYLES: Record<TaskStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  IN_PROGRESS: "bg-info/10 text-info",
  DONE: "bg-success/10 text-success",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: "border-border text-muted-foreground",
  MEDIUM: "border-info/40 text-info",
  HIGH: "border-destructive/40 text-destructive",
};

export function StatusBadge({
  status,
  testId,
}: {
  status: TaskStatus;
  testId?: string;
}) {
  return (
    <Badge
      className={cn(STATUS_STYLES[status])}
      data-status={status}
      data-testid={testId}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function PriorityBadge({
  priority,
  testId,
}: {
  priority: TaskPriority;
  testId?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(PRIORITY_STYLES[priority])}
      data-priority={priority}
      data-testid={testId}
    >
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
