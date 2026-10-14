import { Skeleton } from "@/components/ui/skeleton";

export default function ApiDocsLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando documentação"
      data-testid="api-docs-loading"
    >
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
