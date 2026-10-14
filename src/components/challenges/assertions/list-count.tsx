"use client";

import { useState } from "react";
import { useBug } from "@/components/bugs/bug-context";
import { Panel, ui } from "@/components/challenges/ui";

const CATEGORIES = [
  { id: "perifericos", label: "Periféricos" },
  { id: "audio", label: "Áudio" },
  { id: "monitores", label: "Monitores" },
  { id: "acessorios", label: "Acessórios" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

// 12 produtos fixos: 5 periféricos, 3 de áudio, 2 monitores e 2 acessórios.
// 9 em estoque e 3 esgotados.
const PRODUCTS: Array<{
  sku: string;
  name: string;
  category: CategoryId;
  inStock: boolean;
}> = [
  { sku: "p01", name: "Teclado mecânico", category: "perifericos", inStock: true },
  { sku: "p02", name: "Teclado sem fio", category: "perifericos", inStock: true },
  { sku: "p03", name: "Mouse gamer", category: "perifericos", inStock: true },
  { sku: "p04", name: "Mouse sem fio", category: "perifericos", inStock: false },
  { sku: "p05", name: "Webcam Full HD", category: "perifericos", inStock: true },
  { sku: "p06", name: "Headset com microfone", category: "audio", inStock: true },
  { sku: "p07", name: "Fone Bluetooth", category: "audio", inStock: false },
  { sku: "p08", name: "Caixa de som", category: "audio", inStock: true },
  { sku: "p09", name: "Monitor 24 polegadas", category: "monitores", inStock: true },
  { sku: "p10", name: "Monitor 27 polegadas 4K", category: "monitores", inStock: false },
  { sku: "p11", name: "Mousepad grande", category: "acessorios", inStock: true },
  { sku: "p12", name: "Suporte para notebook", category: "acessorios", inStock: true },
];

// Desafio 6 de assertions: contar itens depois de aplicar filtros.
export function ListCountChallenge() {
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [search, setSearch] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  const extraItemBug = useBug("filter-extra-item");

  const term = search.trim().toLowerCase();
  const matchesOtherFilters = (product: (typeof PRODUCTS)[number]) =>
    (!onlyInStock || product.inStock) &&
    (term === "" || product.name.toLowerCase().includes(term));

  const visible = PRODUCTS.filter(
    (product) =>
      (category === "all" || product.category === category) &&
      matchesOtherFilters(product),
  );

  // Modo Bug: o filtro por categoria traz um produto de outra categoria
  // (sempre o mesmo: o primeiro da lista que não pertence a ela).
  if (extraItemBug && category !== "all") {
    const intruder = PRODUCTS.find(
      (product) => product.category !== category && matchesOtherFilters(product),
    );
    if (intruder) visible.push(intruder);
  }
  const filtering = category !== "all" || onlyInStock || term !== "";

  return (
    <Panel title="Catálogo de produtos" description="Os três filtros se combinam.">
      <div className="grid gap-3">
        <div
          id="category-filters"
          role="group"
          aria-label="Categoria"
          className="flex flex-wrap gap-2"
        >
          {[{ id: "all" as const, label: "Todos" }, ...CATEGORIES].map((item) => (
            <button
              key={item.id}
              id={`category-${item.id}`}
              type="button"
              aria-pressed={category === item.id}
              className={`${ui.button} h-8 rounded-full ${
                category === item.id ? ui.primary : ui.outline
              }`}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="grid min-w-56 flex-1 gap-1.5">
            <label htmlFor="product-search" className={ui.label}>
              Buscar por nome
            </label>
            <input
              id="product-search"
              name="search"
              type="search"
              autoComplete="off"
              placeholder="Ex.: mouse"
              className={ui.input}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <label htmlFor="only-in-stock" className="flex h-9 items-center gap-2 text-sm">
            <input
              id="only-in-stock"
              name="onlyInStock"
              type="checkbox"
              className={ui.check}
              checked={onlyInStock}
              onChange={(event) => setOnlyInStock(event.target.checked)}
            />
            Somente em estoque
          </label>
          <button
            id="clear-filters"
            type="button"
            className={`${ui.button} ${ui.outline}`}
            disabled={!filtering}
            onClick={() => {
              setCategory("all");
              setSearch("");
              setOnlyInStock(false);
            }}
          >
            Limpar filtros
          </button>
        </div>

        <p
          id="results-count"
          aria-live="polite"
          data-count={visible.length}
          className="text-sm text-muted-foreground"
        >
          Mostrando {visible.length} de {PRODUCTS.length} produtos
        </p>

        <ul id="product-list" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <li
              key={product.sku}
              data-sku={product.sku}
              data-category={product.category}
              data-in-stock={product.inStock}
              className="product-item flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
            >
              <span className="min-w-0">
                <span className="product-name block truncate text-sm font-medium">
                  {product.name}
                </span>
                <span className="product-category block text-xs text-muted-foreground">
                  {CATEGORIES.find((item) => item.id === product.category)?.label}
                </span>
              </span>
              <span
                className={`product-stock shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  product.inStock
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {product.inStock ? "Em estoque" : "Esgotado"}
              </span>
            </li>
          ))}
        </ul>

        {visible.length === 0 ? (
          <p
            id="no-results"
            role="status"
            className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground"
          >
            Nenhum produto encontrado com esses filtros.
          </p>
        ) : null}
      </div>
    </Panel>
  );
}
