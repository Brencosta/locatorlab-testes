// Páginas auxiliares dos desafios (conteúdo do iframe e página aberta em
// nova aba). Ficam fora da área logada para não carregar menu nem topo.
export default function EmbedLayout({ children }: LayoutProps<"/embed">) {
  return <div className="flex-1 p-4">{children}</div>;
}
