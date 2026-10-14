"use client";

import { useState } from "react";
import { formatDateBR } from "@/components/challenges/format";
import { Panel, Result, ui } from "@/components/challenges/ui";

// Ordem inicial fixa e propositalmente "bagunçada". Os nomes com acento e as
// datas em dd/mm/aaaa são as armadilhas do desafio.
const CUSTOMERS = [
  { id: 1, name: "Bruno Alves", since: "2024-03-15" },
  { id: 2, name: "Érica Santos", since: "2023-11-02" },
  { id: 3, name: "Álvaro Dias", since: "2024-01-20" },
  { id: 4, name: "Carla Mendes", since: "2022-07-09" },
  { id: 5, name: "Daniel Costa", since: "2024-10-01" },
  { id: 6, name: "Zélia Rocha", since: "2023-02-28" },
  { id: 7, name: "Fábio Lima", since: "2024-03-05" },
  { id: 8, name: "Helena Prado", since: "2021-12-25" },
];

type Customer = (typeof CUSTOMERS)[number];

const SORTS = {
  original: {
    label: "Ordem de cadastro no sistema",
    compare: (a: Customer, b: Customer) => a.id - b.id,
  },
  "name-asc": {
    label: "Nome (A–Z)",
    compare: (a: Customer, b: Customer) => a.name.localeCompare(b.name, "pt-BR"),
  },
  "name-desc": {
    label: "Nome (Z–A)",
    compare: (a: Customer, b: Customer) => b.name.localeCompare(a.name, "pt-BR"),
  },
  "date-desc": {
    label: "Data (mais recente)",
    // Datas ISO (aaaa-mm-dd) podem ser comparadas como texto.
    compare: (a: Customer, b: Customer) => b.since.localeCompare(a.since),
  },
  "date-asc": {
    label: "Data (mais antiga)",
    compare: (a: Customer, b: Customer) => a.since.localeCompare(b.since),
  },
} as const;

type SortKey = keyof typeof SORTS;

// Desafio 9 de assertions: validar a ordem dos itens de uma lista.
export function SortingChallenge() {
  const [sort, setSort] = useState<SortKey>("original");
  const customers = [...CUSTOMERS].sort(SORTS[sort].compare);

  return (
    <Panel title="Clientes" description="8 clientes, sempre os mesmos.">
      <div className="grid gap-3">
        <div className="grid max-w-xs gap-1.5">
          <label htmlFor="sort-by" className={ui.label}>
            Ordenar por
          </label>
          <select
            id="sort-by"
            name="sortBy"
            className={ui.input}
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            {(Object.keys(SORTS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORTS[key].label}
              </option>
            ))}
          </select>
        </div>

        <ol
          id="customer-list"
          data-sort={sort}
          className="grid divide-y rounded-lg border"
        >
          {customers.map((customer, index) => (
            <li
              key={customer.id}
              data-customer-id={customer.id}
              className="customer-item flex items-center gap-3 px-3 py-2 text-sm"
            >
              <span className="customer-position w-5 text-right text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <span className="customer-name flex-1 font-medium">
                {customer.name}
              </span>
              <span className="text-muted-foreground">
                Cliente desde{" "}
                <time className="customer-date tabular-nums" dateTime={customer.since}>
                  {formatDateBR(customer.since)}
                </time>
              </span>
            </li>
          ))}
        </ol>

        <Result id="sort-status">Ordenado por: {SORTS[sort].label}</Result>
      </div>
    </Panel>
  );
}
