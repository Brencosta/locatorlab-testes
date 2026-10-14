import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando perfil"
      data-testid="profile-loading"
    >
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-2">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
