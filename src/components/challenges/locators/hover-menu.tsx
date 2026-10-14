"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Download, FileText, HelpCircle } from "lucide-react";
import { Panel, Result, ui } from "@/components/challenges/ui";

type MenuEntry = { label: string; children?: string[] };

const MENUS: Array<{ id: string; label: string; items: MenuEntry[] }> = [
  {
    id: "products",
    label: "Produtos",
    items: [
      { label: "Notebooks" },
      { label: "Celulares" },
      { label: "Acessórios", children: ["Fones", "Capas", "Carregadores"] },
    ],
  },
  {
    id: "support",
    label: "Suporte",
    items: [{ label: "Central de ajuda" }, { label: "Fale conosco" }],
  },
];

// Pequena folga para o mouse ir do item pai até o submenu sem fechá-lo.
const CLOSE_DELAY_MS = 150;

const MENU_ITEM =
  "flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent";

// Desafio 15: menus, tooltip e botão que só existem durante o hover.
export function HoverMenuChallenge() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const [message, setMessage] = useState("Nenhum item escolhido.");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function open(menuId: string) {
    cancelClose();
    setOpenMenu(menuId);
    if (menuId !== openMenu) setOpenSubmenu(null);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
      setOpenSubmenu(null);
    }, CLOSE_DELAY_MS);
  }

  function choose(path: string) {
    cancelClose();
    setMessage(`Você escolheu: ${path}`);
    setOpenMenu(null);
    setOpenSubmenu(null);
  }

  useEffect(() => cancelClose, []);

  return (
    <div className="grid gap-4">
      <Panel
        title="Menu de navegação"
        description="Os submenus só entram no DOM com o mouse em cima."
      >
        <ul
          id="hover-nav"
          role="menubar"
          aria-label="Menu da loja"
          className="flex flex-wrap gap-1 rounded-lg border p-1"
        >
          {MENUS.map((menu) => (
            <li
              key={menu.id}
              role="none"
              className="relative"
              onMouseEnter={() => open(menu.id)}
              onMouseLeave={scheduleClose}
            >
              <button
                id={`menu-${menu.id}`}
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={openMenu === menu.id}
                className={`${ui.button} hover:bg-muted aria-expanded:bg-muted`}
                onFocus={() => open(menu.id)}
              >
                {menu.label}
                <ChevronDown className="size-4" aria-hidden="true" />
              </button>

              {openMenu === menu.id ? (
                <ul
                  id={`submenu-${menu.id}`}
                  role="menu"
                  aria-label={menu.label}
                  className="absolute top-full left-0 z-20 w-48 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
                >
                  {menu.items.map((item) =>
                    item.children ? (
                      <li
                        key={item.label}
                        role="none"
                        className="relative"
                        onMouseEnter={() => setOpenSubmenu(item.label)}
                        onMouseLeave={() => setOpenSubmenu(null)}
                      >
                        <button
                          type="button"
                          role="menuitem"
                          aria-haspopup="menu"
                          aria-expanded={openSubmenu === item.label}
                          className={MENU_ITEM}
                          onFocus={() => setOpenSubmenu(item.label)}
                        >
                          {item.label}
                          <ChevronRight className="size-4" aria-hidden="true" />
                        </button>

                        {openSubmenu === item.label ? (
                          <ul
                            role="menu"
                            aria-label={item.label}
                            className="z-30 mt-1 w-44 rounded-lg border bg-popover p-1 shadow-md sm:absolute sm:top-0 sm:left-full sm:mt-0"
                          >
                            {item.children.map((child) => (
                              <li key={child} role="none">
                                <button
                                  type="button"
                                  role="menuitem"
                                  className={MENU_ITEM}
                                  onClick={() =>
                                    choose(`${menu.label} › ${item.label} › ${child}`)
                                  }
                                >
                                  {child}
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ) : (
                      <li key={item.label} role="none">
                        <button
                          type="button"
                          role="menuitem"
                          className={MENU_ITEM}
                          onMouseEnter={() => setOpenSubmenu(null)}
                          onClick={() => choose(`${menu.label} › ${item.label}`)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        {/* Espaço para os menus abrirem sem cobrir o resultado. */}
        <div className="h-36" aria-hidden="true" />
        <Result id="menu-result">{message}</Result>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Tooltip" description="Aparece ao passar o mouse no ícone.">
          <div className="flex items-center gap-2 text-sm">
            Prazo de entrega
            <span
              className="relative inline-flex"
              onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() => setTooltip(false)}
            >
              <button
                id="help-icon"
                type="button"
                aria-label="Ajuda sobre o prazo de entrega"
                aria-describedby={tooltip ? "help-tooltip" : undefined}
                className="rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                onFocus={() => setTooltip(true)}
                onBlur={() => setTooltip(false)}
              >
                <HelpCircle className="size-4" aria-hidden="true" />
              </button>
              {tooltip ? (
                <span
                  id="help-tooltip"
                  role="tooltip"
                  className="absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-md bg-foreground px-2 py-1.5 text-xs text-background shadow-md"
                >
                  Entrega em até 5 dias úteis para todo o Brasil.
                </span>
              ) : null}
            </span>
          </div>
        </Panel>

        <Panel
          title="Ação escondida"
          description="O botão só existe com o mouse sobre o cartão."
        >
          <div
            id="report-card"
            className="flex min-h-14 items-center justify-between gap-3 rounded-lg border p-3"
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <FileText className="size-4 text-primary" aria-hidden="true" />
              Relatório mensal
            </span>
            {cardHover ? (
              <button
                id="download-report"
                type="button"
                className={`${ui.button} ${ui.outline} h-8`}
                onClick={() => setMessage("Download iniciado: Relatório mensal")}
              >
                <Download className="size-4" aria-hidden="true" />
                Baixar
              </button>
            ) : null}
          </div>
        </Panel>
      </div>
    </div>
  );
}
