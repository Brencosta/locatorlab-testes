import { Skeleton } from "@/components/ui/skeleton";

export default function LocatorChallengesLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando desafios"
      data-testid="challenges-loading"
    >
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <Skeleton key={index} className="h-44 rounded-xl" />
        ))}
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
