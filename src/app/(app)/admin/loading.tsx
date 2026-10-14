import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando painel"
      data-testid="admin-loading"
    >
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
