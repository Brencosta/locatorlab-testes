// Registro central do Modo Bug.
//
// Cada defeito proposital é uma entrada desta lista. O Modo Bug (uma chave no
// banco, ligada pelo admin) ativa de uma vez todos os que têm `enabled: true`.
//
// Para ADICIONAR um bug:
//   1. Acrescente uma entrada aqui (o `id` passa a existir no tipo BugId).
//   2. No ponto do código onde o defeito acontece, consulte a chave:
//        - no servidor (Server Action, Route Handler, página):
//            if (await isBugActive("meu-bug")) { ... }   // de "@/lib/bugs/server"
//        - em componente cliente dentro de um desafio:
//            const bug = useBug("meu-bug");              // de "@/components/bugs/bug-context"
// Para DESLIGAR um bug sem apagar o código, troque `enabled` para false.
// Para achar onde cada um é aplicado, busque pelo id no projeto.
//
// Este arquivo não importa nada do servidor: pode ser usado em qualquer lugar.

type BugDefinition = {
  id: string;
  /** Nome curto, exibido no painel do professor. */
  title: string;
  /** O que acontece de errado e o que seria o comportamento correto. */
  description: string;
  /** Onde o defeito aparece. */
  where: string;
  href: string;
  /** false tira o bug do Modo Bug sem remover o código. */
  enabled: boolean;
};

export const BUGS = [
  {
    id: "task-save-not-persisted",
    title: "Salvar tarefa não persiste",
    description:
      "Ao editar uma tarefa pela tela, o aviso de sucesso aparece, mas a alteração não é gravada: a lista continua com os dados antigos.",
    where: "Tarefas › Editar",
    href: "/tasks",
    enabled: true,
  },
  {
    id: "cart-total",
    title: "Total do carrinho errado",
    description:
      "O total do carrinho deixa de somar o frete. No estado inicial mostra R$ 379,70 em vez de R$ 399,70.",
    where: "Assertions › Carrinho de compras",
    href: "/challenges/assertions/cart-totals",
    enabled: true,
  },
  {
    id: "success-typo",
    title: "Mensagem de sucesso com erro de digitação",
    description:
      "Ao criar uma tarefa, o aviso diz \"Tarefa criada com suceso.\" em vez de \"Tarefa criada com sucesso.\".",
    where: "Tarefas › Nova tarefa",
    href: "/tasks",
    enabled: true,
  },
  {
    id: "deleted-item-stays",
    title: "Item excluído não some da lista",
    description:
      "Ao excluir uma tarefa pela tela, ela é apagada no banco e o aviso de sucesso aparece, mas a linha continua na lista até a página ser recarregada.",
    where: "Tarefas › Excluir",
    href: "/tasks",
    enabled: true,
  },
  {
    id: "filter-extra-item",
    title: "Filtro retorna um item a mais",
    description:
      "No catálogo de produtos, o filtro por categoria traz um produto de outra categoria. \"Periféricos\" mostra 6 itens em vez de 5.",
    where: "Assertions › Quantidade de itens após filtro",
    href: "/challenges/assertions/list-count",
    enabled: true,
  },
  {
    id: "button-always-enabled",
    title: "Botão habilitado quando deveria estar desabilitado",
    description:
      "O botão \"Criar conta\" fica habilitado mesmo com o formulário inválido, e clicar nele cria a conta sem validar.",
    where: "Localizadores › Botão que só habilita com o formulário válido",
    href: "/challenges/locators/conditional-button",
    enabled: true,
  },
] as const satisfies readonly BugDefinition[];

export type BugId = (typeof BUGS)[number]["id"];

/** Ids dos bugs em vigor, dado o estado do Modo Bug. */
export function resolveActiveBugs(bugMode: boolean): BugId[] {
  if (!bugMode) return [];
  return BUGS.filter((bug) => bug.enabled).map((bug) => bug.id);
}
