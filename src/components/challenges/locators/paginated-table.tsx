"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Result, ui } from "@/components/challenges/ui";

type Employee = {
  id: number;
  name: string;
  role: string;
  city: string;
  salary: number;
};

// Dados fixos: [id, nome, cargo, cidade, salário].
const EMPLOYEES: Employee[] = (
  [
    [1, "Ana Beatriz Lima", "Analista de QA", "São Paulo", 6200],
    [2, "Bruno Carvalho", "Desenvolvedor Backend", "Recife", 8900],
    [3, "Camila Duarte", "Gerente de Produto", "Curitiba", 11500],
    [4, "Daniel Esteves", "Desenvolvedor Frontend", "Porto Alegre", 8400],
    [5, "Eduarda Farias", "Analista de QA", "Belo Horizonte", 6500],
    [6, "Felipe Gomes", "DevOps", "São Paulo", 9800],
    [7, "Gabriela Henriques", "Designer", "Florianópolis", 7200],
    [8, "Henrique Izidoro", "Desenvolvedor Backend", "Salvador", 9100],
    [9, "Isabela Junqueira", "Analista de Dados", "Rio de Janeiro", 8700],
    [10, "João Kleber", "Suporte", "Fortaleza", 4300],
    [11, "Karina Lopes", "Analista de QA", "Recife", 6100],
    [12, "Lucas Moreira", "Desenvolvedor Frontend", "São Paulo", 8600],
    [13, "Mariana Nunes", "Scrum Master", "Curitiba", 9400],
    [14, "Nicolas Oliveira", "Estagiário", "Belo Horizonte", 2100],
    [15, "Olívia Prado", "Designer", "Rio de Janeiro", 7500],
    [16, "Paulo Queiroz", "DevOps", "Porto Alegre", 10200],
    [17, "Quésia Ramos", "Analista de Dados", "Salvador", 8300],
    [18, "Rafael Santos", "Desenvolvedor Backend", "São Paulo", 9500],
    [19, "Sofia Teixeira", "Gerente de Produto", "Florianópolis", 12000],
    [20, "Tiago Uchoa", "Suporte", "Fortaleza", 4100],
    [21, "Úrsula Vieira", "Analista de QA", "Curitiba", 6800],
    [22, "Vinícius Werneck", "Estagiário", "Recife", 2000],
    [23, "Wesley Xavier", "Desenvolvedor Frontend", "Rio de Janeiro", 8200],
    [24, "Yasmin Zanetti", "Scrum Master", "Belo Horizonte", 9700],
  ] as const
).map(([id, name, role, city, salary]) => ({ id, name, role, city, salary }));

type SortKey = "id" | "name" | "role" | "city" | "salary";
type SortDirection = "ascending" | "descending";

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nome" },
  { key: "role", label: "Cargo" },
  { key: "city", label: "Cidade" },
  { key: "salary", label: "Salário" },
];

const PAGE_SIZES = [5, 10];

// "12000" -> "R$ 12.000" (feito à mão para dar o mesmo texto em todo navegador)
function formatSalary(value: number) {
  return `R$ ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

// Desafio 19: tabela com filtro, ordenação e paginação no cliente.
export function PaginatedTableChallenge() {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "id",
    direction: "ascending",
  });
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("Nenhum funcionário selecionado.");

  const term = filter.trim().toLowerCase();
  const filtered = EMPLOYEES.filter(
    (employee) =>
      term === "" ||
      employee.name.toLowerCase().includes(term) ||
      employee.role.toLowerCase().includes(term) ||
      employee.city.toLowerCase().includes(term),
  );

  const sorted = [...filtered].sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    const result =
      typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right), "pt-BR");
    // Empate: mantém a ordem por ID para o resultado ser sempre o mesmo.
    const stable = result === 0 ? a.id - b.id : result;
    return sort.direction === "ascending" ? stable : -stable;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const rows = sorted.slice(start, start + pageSize);

  function handleSort(key: SortKey) {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
    setPage(1);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid min-w-56 flex-1 gap-1.5">
          <label htmlFor="employee-filter" className={ui.label}>
            Filtrar por nome, cargo ou cidade
          </label>
          <input
            id="employee-filter"
            name="filter"
            type="search"
            autoComplete="off"
            placeholder="Ex.: Analista de QA"
            className={ui.input}
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="page-size" className={ui.label}>
            Por página
          </label>
          <select
            id="page-size"
            name="pageSize"
            className={ui.input}
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={ui.tableWrap}>
        <table id="employees-table" className={ui.table}>
          <caption className="sr-only">Funcionários</caption>
          <thead>
            <tr>
              {COLUMNS.map((column) => {
                const active = sort.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    data-column={column.key}
                    aria-sort={active ? sort.direction : "none"}
                    className={ui.th}
                  >
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1 rounded uppercase outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      {!active ? (
                        <ArrowUpDown className="size-3.5 opacity-50" aria-hidden="true" />
                      ) : sort.direction === "ascending" ? (
                        <ArrowUp className="size-3.5" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="size-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className={ui.th}>
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((employee) => (
              <tr key={employee.id} data-employee-id={employee.id}>
                <td className={`${ui.td} tabular-nums`}>{employee.id}</td>
                <td className={`${ui.td} font-medium whitespace-nowrap`}>
                  {employee.name}
                </td>
                <td className={`${ui.td} whitespace-nowrap`}>{employee.role}</td>
                <td className={`${ui.td} whitespace-nowrap`}>{employee.city}</td>
                <td className={`${ui.td} whitespace-nowrap tabular-nums`}>
                  {formatSalary(employee.salary)}
                </td>
                <td className={ui.td}>
                  <button
                    type="button"
                    className={`${ui.button} ${ui.outline} h-7 px-2 text-xs`}
                    onClick={() =>
                      setMessage(
                        `Selecionado: ${employee.name} (ID ${employee.id}), ${employee.role}.`,
                      )
                    }
                  >
                    Selecionar
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr id="no-results-row">
                <td
                  colSpan={COLUMNS.length + 1}
                  className={`${ui.td} py-6 text-center text-muted-foreground`}
                >
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <nav
        aria-label="Paginação da tabela"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <p id="table-info" className="text-sm text-muted-foreground" aria-live="polite">
          {sorted.length === 0
            ? "Mostrando 0 de 0"
            : `Mostrando ${start + 1}–${start + rows.length} de ${sorted.length}`}
        </p>
        <div className="flex items-center gap-1">
          <button
            id="previous-page"
            type="button"
            className={`${ui.button} ${ui.outline} h-8`}
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                type="button"
                aria-label={`Página ${number}`}
                aria-current={number === currentPage ? "page" : undefined}
                data-page={number}
                className={`${ui.button} h-8 w-8 px-0 ${
                  number === currentPage ? ui.primary : "hover:bg-muted"
                }`}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ),
          )}
          <button
            id="next-page"
            type="button"
            className={`${ui.button} ${ui.outline} h-8`}
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Próxima
          </button>
        </div>
      </nav>

      <Result id="table-result">{message}</Result>
    </div>
  );
}
