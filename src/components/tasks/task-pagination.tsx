import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/api-response";
import { cn } from "@/lib/utils";
import { buildTasksHref, type TaskQuery } from "@/lib/validations/task";

/** Páginas a exibir, com "…" quando há muitas: 1 … 4 5 6 … 12 */
function pageItems(current: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | "ellipsis"> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

export function TaskPagination({
  query,
  meta,
}: {
  query: TaskQuery;
  meta: PaginationMeta;
}) {
  const { page, totalPages } = meta;
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const edgeClass = (enabled: boolean) =>
    cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      !enabled && "pointer-events-none opacity-50",
    );

  return (
    <nav
      aria-label="Paginação das tarefas"
      className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row"
      data-testid="tasks-pagination"
    >
      <p className="text-sm text-muted-foreground" data-testid="tasks-page-info">
        Página {page} de {totalPages}
      </p>

      <ul className="flex items-center gap-1">
        <li>
          {hasPrevious ? (
            <Link
              href={buildTasksHref(query, { page: page - 1 })}
              className={edgeClass(true)}
              rel="prev"
              data-testid="pagination-previous"
            >
              <ChevronLeft aria-hidden="true" />
              Anterior
            </Link>
          ) : (
            <span
              className={edgeClass(false)}
              aria-disabled="true"
              data-testid="pagination-previous"
            >
              <ChevronLeft aria-hidden="true" />
              Anterior
            </span>
          )}
        </li>

        {pageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1 text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={item} className="hidden sm:block">
              <Link
                href={buildTasksHref(query, { page: item })}
                aria-label={`Página ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={buttonVariants({
                  variant: item === page ? "default" : "ghost",
                  size: "sm",
                })}
                data-testid={`pagination-page-${item}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {hasNext ? (
            <Link
              href={buildTasksHref(query, { page: page + 1 })}
              className={edgeClass(true)}
              rel="next"
              data-testid="pagination-next"
            >
              Próxima
              <ChevronRight aria-hidden="true" />
            </Link>
          ) : (
            <span
              className={edgeClass(false)}
              aria-disabled="true"
              data-testid="pagination-next"
            >
              Próxima
              <ChevronRight aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
