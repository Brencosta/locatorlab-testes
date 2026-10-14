import { Skeleton } from "@/components/ui/skeleton";

export default function TasksLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando tarefas"
      data-testid="tasks-loading"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="mb-4 h-[74px] rounded-xl" />
      <Skeleton className="mb-3 h-4 w-48" />
      <div className="space-y-2 rounded-xl p-3 ring-1 ring-foreground/10">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
