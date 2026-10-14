"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Panel, Result, ui } from "@/components/challenges/ui";

const STATES = [
  { value: "BA", label: "Bahia" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PE", label: "Pernambuco" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "SP", label: "São Paulo" },
];

const TOOLS = [
  { value: "selenium", label: "Selenium" },
  { value: "cypress", label: "Cypress" },
  { value: "playwright", label: "Playwright" },
  { value: "postman", label: "Postman" },
];

const FRAMEWORKS = [
  "Selenium",
  "Cypress",
  "Playwright",
  "Robot Framework",
  "Appium",
  "WebdriverIO",
];

// Desafio 12: select nativo, select múltiplo e um dropdown feito à mão.
export function DropdownsChallenge() {
  const [state, setState] = useState("");
  const [tools, setTools] = useState<string[]>([]);

  const stateLabel = STATES.find((item) => item.value === state)?.label;
  const toolLabels = TOOLS.filter((item) => tools.includes(item.value)).map(
    (item) => item.label,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Select nativo" description="Um <select> comum.">
        <div className="grid gap-1.5">
          <label htmlFor="state" className={ui.label}>
            Estado
          </label>
          <select
            id="state"
            name="state"
            className={ui.input}
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            <option value="">Selecione um estado</option>
            {STATES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <Result id="state-result" className="mt-3">
          {stateLabel
            ? `Estado selecionado: ${stateLabel} (${state})`
            : "Nenhum estado selecionado."}
        </Result>
      </Panel>

      <Panel
        title="Select múltiplo"
        description="Um <select multiple>: aceita várias opções."
      >
        <div className="grid gap-1.5">
          <label htmlFor="tools" className={ui.label}>
            Ferramentas que você usa
          </label>
          <select
            id="tools"
            name="tools"
            multiple
            size={TOOLS.length}
            className={`${ui.input} h-auto py-1`}
            value={tools}
            onChange={(event) =>
              setTools(
                Array.from(event.target.selectedOptions, (option) => option.value),
              )
            }
          >
            {TOOLS.map((item) => (
              <option key={item.value} value={item.value} className="px-1 py-0.5">
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <Result id="tools-result" className="mt-3">
          {toolLabels.length > 0
            ? `Selecionadas (${toolLabels.length}): ${toolLabels.join(", ")}`
            : "Nenhuma ferramenta selecionada."}
        </Result>
      </Panel>

      <Panel
        title="Dropdown customizado"
        description="Não é um <select>: é um botão que abre uma lista."
      >
        <CustomDropdown />
      </Panel>
    </div>
  );
}

function CustomDropdown() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filtered = FRAMEWORKS.filter((item) =>
    item.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function close() {
    setOpen(false);
    setSearch("");
  }

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <>
      <div className="grid gap-1.5">
        <span id="framework-label" className={ui.label}>
          Framework favorito
        </span>
        <div
          ref={containerRef}
          className="relative"
          onKeyDown={(event) => {
            if (event.key === "Escape" && open) {
              close();
              triggerRef.current?.focus();
            }
          }}
        >
          <button
            ref={triggerRef}
            id="framework-trigger"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls="framework-listbox"
            aria-labelledby="framework-label framework-trigger"
            className={`${ui.button} ${ui.outline} w-full justify-between font-normal`}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span className={selected ? "" : "text-muted-foreground"}>
              {selected ?? "Selecione um framework"}
            </span>
            <ChevronDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </button>

          {/* A lista só existe no DOM enquanto o dropdown está aberto. */}
          {open ? (
            <div
              id="framework-popup"
              className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <input
                id="framework-search"
                type="text"
                autoComplete="off"
                autoFocus
                placeholder="Filtrar..."
                aria-label="Filtrar frameworks"
                className={`${ui.input} mb-1 h-8`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <ul
                id="framework-listbox"
                role="listbox"
                aria-labelledby="framework-label"
                className="max-h-48 overflow-y-auto"
              >
                {filtered.map((item) => (
                  <li
                    key={item}
                    role="option"
                    aria-selected={selected === item}
                    tabIndex={0}
                    data-value={item}
                    className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:bg-accent aria-selected:font-medium"
                    onClick={() => {
                      setSelected(item);
                      close();
                      triggerRef.current?.focus();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(item);
                        close();
                        triggerRef.current?.focus();
                      }
                    }}
                  >
                    {item}
                    {selected === item ? (
                      <Check className="size-4 text-primary" aria-hidden="true" />
                    ) : null}
                  </li>
                ))}
                {filtered.length === 0 ? (
                  <li
                    id="framework-empty"
                    className="px-2 py-1.5 text-sm text-muted-foreground"
                  >
                    Nenhum framework encontrado.
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <Result id="framework-result" className="mt-3">
        {selected
          ? `Framework selecionado: ${selected}`
          : "Nenhum framework selecionado."}
      </Result>
    </>
  );
}
