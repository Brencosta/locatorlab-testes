// Catálogo dos Desafios de Localizadores.
// Aqui ficam só os textos; os componentes interativos estão em
// src/components/challenges/locators.

export const CHALLENGE_LEVELS = ["easy", "medium", "hard"] as const;
export type ChallengeLevel = (typeof CHALLENGE_LEVELS)[number];

export const LEVEL_LABELS: Record<ChallengeLevel, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

export type LocatorChallenge = {
  slug: string;
  number: number;
  title: string;
  level: ChallengeLevel;
  /** Frase curta exibida no catálogo. */
  summary: string;
  /** Explicação exibida na página do desafio. */
  description: string;
  /** O que o aluno deve localizar e fazer. */
  objectives: string[];
  /** Conteúdo do bloco "Dica". Trechos entre crases viram <code>. */
  hints: string[];
  tags: string[];
  /**
   * Desafios sobre ausência de id/data-testid: a área de prática não recebe
   * nenhum desses atributos, nem no contêiner.
   */
  bare?: boolean;
};

export const LOCATOR_CHALLENGES: LocatorChallenge[] = [
  {
    slug: "basic-attributes",
    number: 1,
    title: "Id, name e classes simples",
    level: "easy",
    summary: "Um formulário em que todo elemento tem id, name e class.",
    description:
      "O ponto de partida: cada elemento do formulário tem um id único, um name e uma classe com nome legível. Localize cada um das três formas.",
    objectives: [
      "Preencha o campo Usuário localizando pelo id.",
      "Preencha o campo E-mail localizando pelo name.",
      "Escolha um país e marque a newsletter.",
      "Clique em Salvar localizando pela classe e valide o texto da mensagem de resultado.",
      "Clique em Limpar e valide que os campos ficaram vazios.",
    ],
    hints: [
      "Id é a opção mais direta: `#username` em CSS ou `By.id(\"username\")` no Selenium.",
      "Por name: `[name=\"email\"]` ou `By.name(\"email\")`.",
      "Por classe: `.btn-primary`. Cuidado: `.btn` sozinho encontra os dois botões.",
      "A mensagem de resultado tem o id `result-message`.",
    ],
    tags: ["id", "name", "class"],
  },
  {
    slug: "relative-locators",
    number: 2,
    title: "Sem id: CSS e XPath relativos",
    level: "medium",
    summary: "Clique em \"Editar\" na linha da Maria, sem nenhum id para ajudar.",
    description:
      "Nenhum elemento desta tabela tem id, name ou data-testid, e os botões de todas as linhas são iguais. Você precisa partir de um texto conhecido e navegar até o elemento certo.",
    objectives: [
      "Clique em Editar na linha cujo nome é \"Maria Souza\" (existe também uma \"Mariana Souza\").",
      "Exclua o usuário \"João Pedro\" e valide que a tabela ficou com 4 linhas.",
      "Leia o e-mail do usuário cujo papel é \"Admin\".",
      "Nos planos, clique em Assinar no cartão \"Pro\" e valide a mensagem.",
    ],
    hints: [
      "Em XPath, ache a linha pelo texto e desça até o botão: `//tr[td[normalize-space()=\"Maria Souza\"]]//button[normalize-space()=\"Editar\"]`.",
      "Use igualdade (`=`) em vez de `contains()` para não pegar \"Mariana Souza\".",
      "No Cypress: `cy.contains(\"td\", /^Maria Souza$/).parent().contains(\"button\", \"Editar\")`.",
      "No Playwright: `page.getByRole(\"row\", { name: /^Maria Souza/ }).getByRole(\"button\", { name: \"Editar\" })`.",
    ],
    tags: ["css", "xpath", "tabela"],
    bare: true,
  },
  {
    slug: "dynamic-ids",
    number: 3,
    title: "IDs dinâmicos",
    level: "medium",
    summary: "Os ids mudam a cada carregamento da página. E agora?",
    description:
      "Aqui os elementos têm id, mas uma parte dele é gerada a cada carregamento (recarregue a página e confira). Copiar o id do DevTools não funciona: é preciso achar a parte estável ou usar outra estratégia.",
    objectives: [
      "Preencha Usuário (o id sempre começa com \"user_\").",
      "Preencha Código (o id sempre termina com \"_code\").",
      "Clique em Confirmar (o id contém \"_confirm\") e valide a mensagem.",
      "Clique na \"Opção B\": o id dela é totalmente aleatório.",
      "Recarregue a página e rode o teste de novo: ele precisa continuar passando.",
    ],
    hints: [
      "Seletores de atributo parciais: `[id^=\"user_\"]` (começa com), `[id$=\"_code\"]` (termina com) e `[id*=\"_confirm\"]` (contém).",
      "Em XPath: `//input[starts-with(@id, \"user_\")]` e `//button[contains(@id, \"_confirm\")]`.",
      "Quando o id inteiro é aleatório, ignore-o: use o texto (`//button[normalize-space()=\"Opção B\"]`) ou o label do campo.",
    ],
    tags: ["css", "xpath", "atributos parciais"],
    bare: true,
  },
  {
    slug: "data-testid",
    number: 4,
    title: "Elementos com data-testid",
    level: "easy",
    summary: "A boa prática: atributos criados só para os testes.",
    description:
      "As classes desta loja são geradas por ferramenta e mudam a cada build, mas o time adicionou data-testid nos elementos importantes. É o localizador mais estável que existe, porque não depende de estilo nem de texto.",
    objectives: [
      "Adicione o \"Mouse sem fio\" ao carrinho usando o data-testid do botão.",
      "Adicione o \"Teclado mecânico\" duas vezes.",
      "Valide a quantidade de itens e o total do carrinho.",
      "Esvazie o carrinho e valide que a mensagem de carrinho vazio aparece.",
    ],
    hints: [
      "Em CSS: `[data-testid=\"add-to-cart-mouse\"]`.",
      "No Cypress: `cy.get(\"[data-testid=cart-count]\")`. No Playwright: `page.getByTestId(\"cart-count\")`.",
      "No Selenium: `By.cssSelector(\"[data-testid='cart-total']\")`.",
      "Os produtos seguem o padrão `product-card-{sku}`, `product-price-{sku}` e `add-to-cart-{sku}`, com os skus `mouse`, `keyboard` e `headset`.",
    ],
    tags: ["data-testid", "boa prática"],
  },
  {
    slug: "text-and-role",
    number: 5,
    title: "Só por texto ou role/ARIA",
    level: "medium",
    summary: "Nada de id, class útil ou data-testid: localize como um usuário faria.",
    description:
      "Os elementos desta tela não têm id, name nem data-testid, e todos os botões compartilham as mesmas classes. Restam o texto visível, o label, o placeholder e os papéis de acessibilidade (role e aria-label).",
    objectives: [
      "Clique no botão \"Salvar\" (não em \"Salvar rascunho\" nem em \"Salvar e publicar\").",
      "Clique no botão de favoritar, que só tem ícone, e valide que ele ficou pressionado.",
      "Preencha o campo \"Título do documento\" pelo label e a busca pelo placeholder.",
      "Ligue o interruptor \"Modo foco\" e valide o estado dele.",
      "Feche o aviso de alterações não salvas e valide que ele sumiu.",
      "Clique no link \"Relatórios\" dentro da navegação \"Seções\".",
    ],
    hints: [
      "Playwright e Testing Library: `getByRole(\"button\", { name: \"Salvar\", exact: true })`.",
      "Botões só com ícone têm aria-label: `[aria-label=\"Favoritar\"]` ou `getByRole(\"button\", { name: \"Favoritar\" })`. O estado fica em `aria-pressed`.",
      "XPath por texto exato: `//button[normalize-space()=\"Salvar\"]`.",
      "Campos: `getByLabel(\"Título do documento\")`, `getByPlaceholder(\"Buscar no documento\")` ou `//label[contains(., \"Título do documento\")]//input`.",
      "O interruptor é `[role=\"switch\"]` e o estado fica em `aria-checked`. O aviso é `[role=\"alert\"]`.",
    ],
    tags: ["texto", "role", "aria"],
    bare: true,
  },
  {
    slug: "repeated-items",
    number: 6,
    title: "Listas e tabelas com itens repetidos",
    level: "medium",
    summary: "\"Teclado\", \"Teclado Mecânico\", \"Teclado Mecânico RGB\"...",
    description:
      "Textos parecidos e botões idênticos em todos os itens. Um seletor apressado encontra vários elementos (ou o elemento errado). O treino é restringir a busca ao item certo e contar resultados.",
    objectives: [
      "Adicione ao carrinho exatamente o produto \"Teclado\" (não o Mecânico nem o RGB).",
      "Adicione o \"Mouse Gamer\" e valide o contador do carrinho.",
      "Valide que o botão do produto esgotado está desabilitado.",
      "Na tabela, abra os detalhes do pedido da cliente \"Ana\" cujo produto é exatamente \"Teclado\".",
      "Conte quantos pedidos estão com status \"Pendente\" (devem ser 4).",
    ],
    hints: [
      "Texto exato em XPath: `//li[.//h4[normalize-space()=\"Teclado\"]]//button`.",
      "No Cypress, use regex ancorada: `cy.contains(\"h4\", /^Teclado$/)`. No Playwright: `getByRole(\"heading\", { name: \"Teclado\", exact: true })`.",
      "Para combinar duas colunas: `//tr[td[2][normalize-space()=\"Ana\"] and td[3][normalize-space()=\"Teclado\"]]//button`.",
      "Para contar: `//td[normalize-space()=\"Pendente\"]` com `findElements` (Selenium), `.should(\"have.length\", 4)` (Cypress) ou `toHaveCount(4)` (Playwright).",
    ],
    tags: ["listas", "tabela", "texto exato", "contagem"],
    bare: true,
  },
  {
    slug: "nested-elements",
    number: 7,
    title: "Elementos aninhados profundamente",
    level: "hard",
    summary: "A mesma tarefa aparece em três lugares de uma árvore com muitos níveis.",
    description:
      "Uma estrutura Departamento › Equipe › Projeto › Tarefa, cheia de divs intermediárias e sem ids. Tarefas e projetos com o mesmo nome se repetem em ramos diferentes, então é preciso encadear o caminho inteiro.",
    objectives: [
      "Aprove a tarefa \"Revisar contrato\" do projeto \"Portal\", da equipe \"Backend\", do departamento \"Engenharia\".",
      "Valide que só essa tarefa mudou para \"Aprovada\" (as outras duas \"Revisar contrato\" continuam aguardando).",
      "Aprove \"Aprovar orçamento\" em Marketing › Conteúdo › Campanha de lançamento.",
      "Conte quantas tarefas existem no departamento \"Engenharia\" (devem ser 6).",
    ],
    hints: [
      "Cada nível tem uma classe semântica: `.department`, `.team`, `.project` e `.task`. O nome de cada um fica em um título (`h4`, `h5`, `h6`) ou em `.task-name`.",
      "Em XPath, `contains(@class, \"task\")` também casa com `task-name` e `task-status`; por isso o exemplo abaixo chega na tarefa pelo `li`.",
      "Encadeie os níveis em XPath: `//section[contains(@class,\"department\")][.//h4[normalize-space()=\"Engenharia\"]]//div[contains(@class,\"team\")][.//h5[normalize-space()=\"Backend\"]]//div[contains(@class,\"project\")][.//h6[normalize-space()=\"Portal\"]]//li[.//span[normalize-space()=\"Revisar contrato\"]]//button`.",
      "No Playwright, encadeie filtros: `page.locator(\".department\").filter({ hasText: \"Engenharia\" }).locator(\".team\").filter({ has: page.getByRole(\"heading\", { name: \"Backend\" }) })...`.",
      "Evite XPath absoluto (`/html/body/div[2]/div...`): qualquer mudança no layout quebra o teste.",
    ],
    tags: ["xpath", "css descendente", "escopo"],
    bare: true,
  },
  {
    slug: "iframe",
    number: 8,
    title: "Iframe com formulário",
    level: "hard",
    summary: "O formulário está em outro documento, dentro de um iframe.",
    description:
      "O formulário de inscrição fica dentro de um iframe. Para o navegador ele é outro documento: os seletores da página principal não enxergam o que está lá dentro até você trocar de contexto.",
    objectives: [
      "Fora do iframe, preencha \"E-mail para novidades\" e clique em Assinar.",
      "Entre no iframe e preencha Nome, E-mail e Curso.",
      "Envie a inscrição e valide a mensagem de sucesso (ela está dentro do iframe).",
      "Volte para a página principal e valide a mensagem da newsletter.",
    ],
    hints: [
      "O iframe tem `id=\"signup-frame\"`, `name=\"inscricao\"` e `title=\"Formulário de inscrição\"`.",
      "Selenium: `driver.switchTo().frame(\"signup-frame\")` para entrar e `driver.switchTo().defaultContent()` para voltar.",
      "Playwright: `page.frameLocator(\"#signup-frame\").getByLabel(\"Nome\")`.",
      "Cypress: `cy.get(\"#signup-frame\").its(\"0.contentDocument.body\").should(\"not.be.empty\").then(cy.wrap).find(\"#name\")`.",
      "Dentro e fora do iframe existe um campo de e-mail: confira em qual contexto você está.",
    ],
    tags: ["iframe", "contexto"],
  },
  {
    slug: "shadow-dom",
    number: 9,
    title: "Shadow DOM",
    level: "hard",
    summary: "Elementos encapsulados que o document.querySelector não alcança.",
    description:
      "O formulário de cupom está dentro de um shadow root, e o botão de confirmação está em um segundo shadow root aninhado. Seletores CSS comuns e XPath não atravessam essa fronteira.",
    objectives: [
      "Digite o cupom LOCATOR10 no campo que está dentro do shadow root.",
      "Clique em \"Aplicar cupom\" e valide a mensagem de desconto.",
      "Tente um cupom inválido e valide a mensagem de erro.",
      "Clique em \"Confirmar pedido\", que está em um shadow root dentro do primeiro.",
    ],
    hints: [
      "O host externo é `#shadow-host`; dentro dele, o host aninhado é `#nested-host`. Os dois shadow roots são abertos (`mode: \"open\"`).",
      "Playwright atravessa shadow DOM aberto sozinho: `page.locator(\"#shadow-input\")` funciona. XPath não atravessa.",
      "Cypress: `cy.get(\"#shadow-host\").shadow().find(\"#shadow-input\")`, ou a opção `includeShadowDom: true`.",
      "Selenium 4: `driver.findElement(By.id(\"shadow-host\")).getShadowRoot().findElement(By.cssSelector(\"#shadow-input\"))`. Dentro do shadow root use CSS, não XPath.",
    ],
    tags: ["shadow dom", "web components"],
  },
  {
    slug: "waits",
    number: 10,
    title: "Esperas: aparece, some e muda de texto",
    level: "medium",
    summary: "Elementos com atraso de 2 a 5 segundos. Nada de sleep fixo!",
    description:
      "Três situações de sincronização: um elemento que só aparece depois de 3 segundos, um aviso que some depois de 4 e um status que muda de texto aos 2 e aos 5 segundos. O objetivo é esperar pela condição, não por um tempo fixo.",
    objectives: [
      "Clique em \"Carregar dados\" e espere a mensagem de sucesso aparecer.",
      "Clique em \"Mostrar aviso\", espere o aviso sumir e só então clique em Continuar.",
      "Clique em \"Iniciar processamento\" e espere o status virar \"Concluído\".",
      "Valide que o indicador \"Carregando...\" não existe mais depois que os dados chegam.",
    ],
    hints: [
      "Selenium: `new WebDriverWait(driver, Duration.ofSeconds(10)).until(ExpectedConditions.visibilityOfElementLocated(By.id(\"delayed-message\")))`.",
      "Para o que some: `ExpectedConditions.invisibilityOfElementLocated(By.id(\"temporary-banner\"))`. Para texto: `textToBe(By.id(\"process-status\"), \"Concluído\")`.",
      "Cypress repete a asserção sozinho, mas o padrão é 4 s: `cy.get(\"#process-status\", { timeout: 10000 }).should(\"have.text\", \"Concluído\")`.",
      "Playwright: `await expect(page.locator(\"#process-status\")).toHaveText(\"Concluído\", { timeout: 10000 })` e `toBeHidden()` para o aviso.",
      "O status também expõe `data-state` (`idle`, `queued`, `processing`, `done`).",
    ],
    tags: ["waits", "sincronização"],
  },
  {
    slug: "conditional-button",
    number: 11,
    title: "Botão que só habilita com o formulário válido",
    level: "easy",
    summary: "O botão começa desabilitado. Valide o estado antes e depois.",
    description:
      "O botão \"Criar conta\" só é habilitado quando todos os campos são válidos. Há também um botão que usa aria-disabled em vez do atributo disabled, o que muda a forma de validar.",
    objectives: [
      "Valide que \"Criar conta\" começa desabilitado.",
      "Preencha nome (mínimo de 3 letras), e-mail válido, senha (mínimo de 6 caracteres) e aceite os termos.",
      "Valide que o botão habilitou, clique e confira a mensagem de sucesso.",
      "Apague um campo e valide que o botão volta a ficar desabilitado.",
      "No segundo bloco, digite CONFIRMAR e valide a mudança do aria-disabled.",
    ],
    hints: [
      "Selenium: `element.isEnabled()`. Cypress: `.should(\"be.disabled\")` e `.should(\"be.enabled\")`. Playwright: `toBeDisabled()` e `toBeEnabled()`.",
      "O botão principal é `#create-account`; a lista de requisitos mostra `data-valid=\"true\"` em cada item atendido.",
      "O segundo botão (`#danger-continue`) nunca recebe `disabled`: valide o atributo `aria-disabled`.",
      "Cuidado com a diferença: no Selenium `isEnabled()` devolve true para esse botão e no Cypress `.should(\"be.disabled\")` falha, porque só olham o atributo disabled. Já o `toBeDisabled()` do Playwright considera o `aria-disabled`.",
    ],
    tags: ["estado", "disabled", "formulário"],
  },
  {
    slug: "dropdowns",
    number: 12,
    title: "Dropdown nativo e customizado",
    level: "medium",
    summary: "Um <select> de verdade e um dropdown feito com div e botões.",
    description:
      "O select nativo tem comandos prontos em todos os frameworks. O dropdown customizado não é um select: é preciso clicar para abrir, esperar as opções e clicar na opção.",
    objectives: [
      "No select nativo, escolha \"Minas Gerais\" e valide o valor selecionado.",
      "No select múltiplo, selecione \"Cypress\" e \"Playwright\".",
      "No dropdown customizado, abra a lista e escolha \"Robot Framework\".",
      "Use a busca do dropdown customizado para filtrar por \"app\" e escolha \"Appium\".",
      "Valide que as opções do dropdown customizado não existem no DOM quando ele está fechado.",
    ],
    hints: [
      "Nativo: `new Select(driver.findElement(By.id(\"state\"))).selectByVisibleText(\"Minas Gerais\")`, `cy.get(\"#state\").select(\"MG\")` ou `page.selectOption(\"#state\", \"MG\")`.",
      "Múltiplo: `cy.get(\"#tools\").select([\"cypress\", \"playwright\"])` ou `page.selectOption(\"#tools\", [\"cypress\", \"playwright\"])`.",
      "Customizado: clique em `#framework-trigger`, depois em `[role=\"option\"]` com o texto desejado. Esses comandos de select não funcionam nele.",
      "O gatilho expõe `aria-expanded` e a opção escolhida fica com `aria-selected=\"true\"`.",
    ],
    tags: ["select", "listbox", "aria"],
  },
  {
    slug: "selection-controls",
    number: 13,
    title: "Checkboxes, radio buttons e toggles",
    level: "easy",
    summary: "Marcar, desmarcar e validar o estado de cada controle.",
    description:
      "Controles de seleção nativos e customizados. Além de clicar, o importante é validar o estado: marcado, desmarcado, indeterminado e desabilitado.",
    objectives: [
      "Marque \"E-mail\" e \"Push\" e valide que \"SMS\" continua desmarcado.",
      "Valide que \"WhatsApp\" está desabilitado.",
      "Use \"Selecionar todas\" e valide o estado das opções habilitadas.",
      "Escolha o plano \"Pro\" e valide que \"Gratuito\" foi desmarcado.",
      "Desligue \"Salvar automaticamente\" e ligue \"Notificações sonoras\".",
      "Marque o checkbox customizado \"Aceito receber ofertas\".",
    ],
    hints: [
      "Estado: `isSelected()` (Selenium), `.should(\"be.checked\")` (Cypress), `toBeChecked()` (Playwright).",
      "Use `.check()` e `.uncheck()` em vez de `.click()`: eles não invertem um controle que já está no estado certo.",
      "Os toggles são botões com `role=\"switch\"`: o estado está em `aria-checked`, não em `checked`.",
      "No checkbox customizado o input real (`#offers`) fica escondido atrás do desenho. Clique no label, ou use `check({ force: true })`.",
      "\"Selecionar todas\" fica em estado indeterminado quando só parte está marcada: confira a propriedade `indeterminate`.",
    ],
    tags: ["checkbox", "radio", "switch", "estado"],
  },
  {
    slug: "dialogs",
    number: 14,
    title: "Modal, alert, confirm e prompt",
    level: "medium",
    summary: "Um modal de HTML e os três diálogos nativos do navegador.",
    description:
      "O modal faz parte da página e é localizado como qualquer elemento. Alert, confirm e prompt são janelas do navegador: não têm HTML e cada framework tem uma API específica para lidar com eles.",
    objectives: [
      "Abra o modal, preencha o nome do projeto e confirme. Valide a mensagem.",
      "Abra o modal de novo e feche pelo botão Cancelar e pela tecla Esc.",
      "Dispare o alert, leia o texto e aceite.",
      "Dispare o confirm: aceite uma vez e cancele outra, validando as duas mensagens.",
      "Dispare o prompt, digite seu nome e valide a saudação.",
    ],
    hints: [
      "O modal é `[role=\"dialog\"]`; os campos dele só existem no DOM enquanto está aberto.",
      "Selenium: `driver.switchTo().alert()` e depois `.getText()`, `.accept()`, `.dismiss()` ou `.sendKeys(\"texto\")`.",
      "Playwright: registre antes do clique: `page.once(\"dialog\", (d) => d.accept(\"Maria\"))`.",
      "Cypress aceita alert e confirm sozinho. Para cancelar: `cy.on(\"window:confirm\", () => false)`. Para o prompt: `cy.window().then((w) => cy.stub(w, \"prompt\").returns(\"Maria\"))`.",
    ],
    tags: ["modal", "alert", "confirm", "prompt"],
  },
  {
    slug: "hover-menu",
    number: 15,
    title: "Menu que abre no hover",
    level: "medium",
    summary: "Os itens só existem enquanto o mouse está em cima do menu.",
    description:
      "Os submenus não estão no DOM até o mouse passar sobre o item pai. Clicar direto não funciona: é preciso simular o movimento do mouse, inclusive em dois níveis.",
    objectives: [
      "Passe o mouse em \"Produtos\" e clique em \"Notebooks\".",
      "Passe o mouse em \"Produtos\", depois em \"Acessórios\", e clique em \"Fones\".",
      "Passe o mouse no ícone de ajuda e valide o texto do tooltip.",
      "Passe o mouse no cartão do relatório e clique no botão \"Baixar\", que só aparece no hover.",
    ],
    hints: [
      "Selenium: `new Actions(driver).moveToElement(menu).perform()` e depois localize o item.",
      "Playwright: `await page.getByRole(\"button\", { name: \"Produtos\" }).hover()`.",
      "Cypress não tem hover real: use `.trigger(\"mouseover\")` (este menu reage a esse evento) ou o plugin cypress-real-events com `.realHover()`.",
      "Os menus são `[role=\"menu\"]` e os itens `[role=\"menuitem\"]`; o tooltip é `[role=\"tooltip\"]`.",
    ],
    tags: ["hover", "actions", "menu"],
  },
  {
    slug: "drag-and-drop",
    number: 16,
    title: "Drag and drop",
    level: "hard",
    summary: "Um quadro com drag and drop HTML5 e um arraste feito com eventos de ponteiro.",
    description:
      "Dois tipos de arraste. O quadro usa a API de drag and drop do HTML5 (dragstart, dragover, drop), que costuma não funcionar com ações simples de mouse. O segundo bloco usa eventos de ponteiro e responde a arrastes comuns.",
    objectives: [
      "Arraste \"Escrever testes\" para a coluna \"Em andamento\".",
      "Arraste \"Revisar PR\" para \"Concluído\" e valide os contadores das colunas.",
      "Arraste a ficha até a área de destino e valide a mensagem.",
      "Solte a ficha fora da área e valide que ela volta para o lugar.",
    ],
    hints: [
      "Playwright: `await page.locator(\"#card-write-tests\").dragTo(page.locator(\"#column-doing\"))` funciona nos dois blocos.",
      "Cypress no quadro HTML5: dispare os eventos com um DataTransfer: `const dataTransfer = new DataTransfer()` e depois `.trigger(\"dragstart\", { dataTransfer })`, `.trigger(\"dragover\", { dataTransfer })` e `.trigger(\"drop\", { dataTransfer })`.",
      "Selenium: `new Actions(driver).dragAndDrop(origem, destino).perform()` funciona na ficha. No quadro HTML5 costuma falhar; a saída comum é disparar os eventos de drag por JavaScript.",
      "Na ficha, com Cypress: `.trigger(\"pointerdown\", { clientX, clientY })`, `.trigger(\"pointermove\", ...)` e `.trigger(\"pointerup\", ...)`.",
    ],
    tags: ["drag and drop", "actions", "html5"],
  },
  {
    slug: "file-upload",
    number: 17,
    title: "Upload de arquivo",
    level: "medium",
    summary: "Input visível, input múltiplo e input escondido atrás de um botão.",
    description:
      "Para enviar um arquivo em um teste você não clica em \"Escolher arquivo\" (a janela do sistema operacional não é automatizável): você entrega o caminho do arquivo direto ao input type=file, mesmo quando ele está escondido.",
    objectives: [
      "Selecione um arquivo no input simples, clique em Enviar e valide a mensagem com o nome do arquivo.",
      "Selecione dois arquivos de imagem no input múltiplo e valide a lista.",
      "Envie um PDF pelo input escondido atrás do botão \"Escolher documento\".",
      "Envie um arquivo que não é PDF no mesmo input e valide a mensagem de erro.",
    ],
    hints: [
      "Selenium: `driver.findElement(By.id(\"single-file\")).sendKeys(\"/caminho/absoluto/arquivo.txt\")`.",
      "Cypress: `cy.get(\"#single-file\").selectFile(\"cypress/fixtures/arquivo.txt\")`. Para o escondido: `selectFile(caminho, { force: true })`.",
      "Playwright: `await page.setInputFiles(\"#multiple-files\", [\"a.png\", \"b.png\"])`. Funciona também em input escondido.",
      "O input escondido é `#hidden-file` (tem `display: none`). No Selenium, torne-o visível por JavaScript antes do `sendKeys`.",
    ],
    tags: ["upload", "input file"],
  },
  {
    slug: "new-tabs",
    number: 18,
    title: "Abas e janelas novas",
    level: "hard",
    summary: "Um link com target=\"_blank\" e um pop-up aberto com window.open.",
    description:
      "O link abre o comprovante em outra aba e o botão abre o mesmo conteúdo em uma janela pop-up. O teste precisa trocar o foco para a nova janela, agir lá e voltar para a original.",
    objectives: [
      "Clique no link e troque para a nova aba.",
      "Na nova aba, valide o título da página e leia o código do comprovante (LL-2048).",
      "Clique em \"Confirmar leitura\" na nova aba.",
      "Volte para a aba original e valide a mensagem de confirmação recebida.",
      "Repita usando o botão que abre o pop-up.",
    ],
    hints: [
      "Selenium: guarde `driver.getWindowHandle()`, clique, percorra `driver.getWindowHandles()` e use `driver.switchTo().window(handle)`.",
      "Playwright: `const [novaAba] = await Promise.all([context.waitForEvent(\"page\"), link.click()])`. Para o pop-up: `page.waitForEvent(\"popup\")`.",
      "Cypress não controla várias abas. Saídas comuns: remover o target (`.invoke(\"removeAttr\", \"target\")`) antes de clicar, ou validar o `href` e visitar a URL.",
      "O link é `#open-tab-link` e o botão é `#open-popup-button`. A mensagem de retorno aparece em `#tab-result`.",
    ],
    tags: ["abas", "janelas", "target blank"],
  },
  {
    slug: "paginated-table",
    number: 19,
    title: "Tabela paginada e ordenável",
    level: "hard",
    summary: "24 funcionários, 5 por página, ordenação por coluna e filtro.",
    description:
      "O dado que você procura pode não estar na página atual, e a posição das linhas muda conforme a ordenação. Localizar por posição fixa não funciona: combine ordenação, paginação e busca por conteúdo.",
    objectives: [
      "Valide que a primeira página mostra 5 linhas e o texto \"Mostrando 1–5 de 24\".",
      "Ordene por Salário em ordem decrescente e valide quem é o primeiro da lista (Sofia Teixeira).",
      "Navegue até encontrar \"Rafael Santos\" e clique em Selecionar na linha dele.",
      "Mude para 10 por página e valide a quantidade de linhas e de páginas.",
      "Filtre por \"Analista de QA\" e valide que restam 4 funcionários.",
    ],
    hints: [
      "O cabeçalho ordenado expõe `aria-sort=\"ascending\"` ou `\"descending\"`. Clique uma vez para crescente e outra para decrescente.",
      "Para achar uma linha em qualquer página, faça um laço: procure o texto; se não achar, clique em `#next-page` enquanto ele estiver habilitado.",
      "Cada linha tem `data-employee-id`. A linha do Rafael é `tr[data-employee-id=\"18\"]`, mas só existe no DOM quando a página dele está aberta.",
      "Contar linhas: `#employees-table tbody tr`.",
    ],
    tags: ["tabela", "paginação", "ordenação"],
  },
];

export function getLocatorChallenge(slug: string) {
  return LOCATOR_CHALLENGES.find((challenge) => challenge.slug === slug);
}
