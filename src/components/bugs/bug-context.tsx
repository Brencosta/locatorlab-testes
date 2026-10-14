"use client";

import { createContext, useContext } from "react";
import type { BugId } from "@/lib/bugs/registry";

// Lado cliente do Modo Bug. A lista de bugs ativos vem do servidor (calculada
// na página, a cada carregamento) e chega aos componentes por contexto.
// Nada aqui é renderizado: não há indicação visual de que o modo está ligado.

const BugContext = createContext<readonly BugId[]>([]);

export function BugProvider({
  bugs,
  children,
}: {
  bugs: readonly BugId[];
  children: React.ReactNode;
}) {
  return <BugContext.Provider value={bugs}>{children}</BugContext.Provider>;
}

/** Use nos componentes cliente onde um defeito deve acontecer. */
export function useBug(id: BugId) {
  return useContext(BugContext).includes(id);
}
