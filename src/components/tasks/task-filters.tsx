"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import {
  PRIORITY_LABELS,
  SORT_LABELS,
  STATUS_LABELS,
} from "@/lib/task-labels";
import {
  buildTasksHref,
  DEFAULT_TASK_QUERY,
  TASK_PAGE_SIZES,
  TASK_PRIORITIES,
  TASK_SORTS,
  TASK_STATUSES,
  type TaskQuery,
} from "@/lib/validations/task";

const SEARCH_DEBOUNCE_MS = 350;

/** Busca, filtros e ordenação. O estado fica na URL (compartilhável). */
export function TaskFilters({ query }: { query: TaskQuery }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search);
  // Último termo que este componente enviou para a URL e último termo visto
  // nela. Se a URL mudar por outro caminho (link "Limpar filtros", botão
  // voltar), o campo acompanha; se mudou por causa da digitação, não mexemos
  // no que a pessoa ainda está escrevendo.
  const [pushedSearch, setPushedSearch] = useState(query.search);
  const [seenSearch, setSeenSearch] = useState(query.search);
  if (query.search !== seenSearch) {
    setSeenSearch(query.search);
    if (query.search !== pushedSearch) {
      setSearch(query.search);
      setPushedSearch(query.search);
    }
  }

  // Qualquer mudança de filtro volta para a primeira página.
  function update(overrides: Partial<TaskQuery>) {
    if (overrides.search !== undefined) setPushedSearch(overrides.search);
    startTransition(() => {
      router.replace(buildTasksHref(query, { ...overrides, page: 1 }), {
        scroll: false,
      });
    });
  }

  // Aplica a busca depois que a pessoa para de digitar.
  useEffect(() => {
    const term = search.trim();
    if (term === query.search) return;
    const timer = setTimeout(() => update({ search: term }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, query.search]);

  const hasFilters =
    query.search !== "" ||
    query.status !== undefined ||
    query.priority !== undefined ||
    query.sort !== DEFAULT_TASK_QUERY.sort;

  function clearFilters() {
    setSearch("");
    update({
      search: "",
      status: undefined,
      priority: undefined,
      sort: DEFAULT_TASK_QUERY.sort,
    });
  }

  return (
    <form
      role="search"
      aria-label="Filtrar tarefas"
      onSubmit={(event) => {
        event.preventDefault();
        update({ search: search.trim() });
      }}
      className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 lg:grid-cols-[minmax(0,1fr)_repeat(4,auto)_auto] lg:items-end"
      data-testid="tasks-filters"
    >
      <div className="col-span-2 grid gap-1.5 lg:col-span-1">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search"
            name="search"
            type="search"
            placeholder="Buscar por título ou descrição"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-8"
            data-testid="tasks-search-input"
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="filter-status">Status</Label>
        <NativeSelect
          id="filter-status"
          name="status"
          value={query.status ?? ""}
          onChange={(event) =>
            update({
              status: (event.target.value || undefined) as TaskQuery["status"],
            })
          }
          data-testid="tasks-status-filter"
        >
          <option value="">Todos</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="filter-priority">Prioridade</Label>
        <NativeSelect
          id="filter-priority"
          name="priority"
          value={query.priority ?? ""}
          onChange={(event) =>
            update({
              priority: (event.target.value ||
                undefined) as TaskQuery["priority"],
            })
          }
          data-testid="tasks-priority-filter"
        >
          <option value="">Todas</option>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="filter-sort">Ordenar por</Label>
        <NativeSelect
          id="filter-sort"
          name="sort"
          value={query.sort}
          onChange={(event) =>
            update({ sort: event.target.value as TaskQuery["sort"] })
          }
          data-testid="tasks-sort-select"
        >
          {TASK_SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {SORT_LABELS[sort]}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="filter-page-size">Por página</Label>
        <NativeSelect
          id="filter-page-size"
          name="pageSize"
          value={String(query.pageSize)}
          onChange={(event) => update({ pageSize: Number(event.target.value) })}
          data-testid="tasks-page-size-select"
        >
          {/* Mantém a opção atual mesmo que venha um valor fora da lista. */}
          {Array.from(new Set([...TASK_PAGE_SIZES, query.pageSize]))
            .sort((a, b) => a - b)
            .map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
        </NativeSelect>
      </div>

      <div className="col-span-2 flex items-center gap-2 lg:col-span-1">
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          disabled={!hasFilters}
          data-testid="tasks-clear-filters-button"
        >
          <X aria-hidden="true" />
          Limpar
        </Button>
        <span
          role="status"
          aria-live="polite"
          className="flex size-5 items-center justify-center"
        >
          {pending ? (
            <>
              <Loader2
                className="size-4 animate-spin text-muted-foreground"
                aria-hidden="true"
                data-testid="tasks-loading-indicator"
              />
              <span className="sr-only">Atualizando a lista...</span>
            </>
          ) : null}
        </span>
      </div>
    </form>
  );
}
