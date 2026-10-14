// Seções da mini loja do desafio "URL e título após navegação".
// Usado pela página (para definir o <title>) e pelo componente do desafio.

export const STORE_SECTIONS = {
  inicio: { label: "Início", title: "Início | Loja Demo" },
  pedidos: { label: "Meus pedidos", title: "Meus pedidos | Loja Demo" },
  perfil: { label: "Meu perfil", title: "Meu perfil | Loja Demo" },
  login: { label: "Entrar", title: "Entrar | Loja Demo" },
} as const;

export type StoreSection = keyof typeof STORE_SECTIONS;

/** Seção indicada por ?section=; valores desconhecidos caem em "inicio". */
export function parseStoreSection(
  value: string | string[] | null | undefined,
): StoreSection {
  const single = Array.isArray(value) ? value[0] : value;
  return single && single in STORE_SECTIONS
    ? (single as StoreSection)
    : "inicio";
}
