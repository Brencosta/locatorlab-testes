# LocatorLab

Ambiente de prática para aulas de automação de testes. Os alunos treinam
**localizadores** (id, name, class, CSS, XPath, data-testid, texto, role/ARIA) e
**assertions** (texto, visibilidade, estado, atributos, URL, quantidade de itens,
respostas de API) usando Selenium, Cypress e Playwright.

## Sumário

1. [Visão geral](#visão-geral)
2. [Credenciais de teste](#credenciais-de-teste)
3. [Como rodar localmente](#como-rodar-localmente)
4. [Deploy na Vercel](#deploy-na-vercel)
5. [Reset do banco](#reset-do-banco)
6. [Modo Bug](#modo-bug)
7. [API REST](#api-rest)
8. [Convenção de data-testid](#convenção-de-data-testid)
9. [Exercícios sugeridos](#exercícios-sugeridos)
10. [Respostas esperadas](#respostas-esperadas)
11. [Estrutura do projeto](#estrutura-do-projeto)

## Visão geral

O LocatorLab tem cara de produto real (login, dashboard, tarefas, perfil) e, ao
lado dele, áreas feitas para o treino de automação.

| Área                        | Rota                     | Para quê                                                         |
| --------------------------- | ------------------------ | ---------------------------------------------------------------- |
| Login e cadastro            | `/login`, `/register`    | Formulários com mensagens de erro por campo                      |
| Dashboard                   | `/dashboard`             | Contadores e resumos que mudam conforme as tarefas               |
| Tarefas                     | `/tasks`                 | CRUD com busca, filtros, ordenação, paginação e toasts           |
| Perfil                      | `/profile`               | Edição de dados, troca de senha e upload de avatar               |
| Desafios de Localizadores   | `/challenges/locators`   | 19 desafios, de id simples a shadow DOM                          |
| Desafios de Assertions      | `/challenges/assertions` | 10 desafios, de texto exato a respostas de API                   |
| Documentação da API         | `/api-docs`              | Cada endpoint com parâmetros, exemplos e status codes            |
| Painel Admin                | `/admin`                 | Usuários, restauração do banco e Modo Bug (somente admin)        |

Cada página de desafio tem a descrição, a lista "O que localizar" ou "O que
validar", a área de prática (com botão "Reiniciar desafio") e um bloco "Dica"
recolhível. Os desafios não gravam nada no banco: recarregar a página volta ao
estado inicial.

Princípios do projeto:

- **Determinístico.** Os dados do seed, os valores dos desafios e os tempos de
  espera são sempre os mesmos. A única exceção proposital é o desafio de IDs
  dinâmicos.
- **Feito para testar.** Elementos principais com `data-testid`, `id`, `name`,
  labels e roles ARIA, para que o mesmo elemento possa ser localizado de várias
  formas. Animações curtas (200 ms) que respeitam "reduzir movimento".
- **Acessível e responsivo.** Navegação por teclado, link "Pular para o
  conteúdo", tema claro e escuro e layout que funciona a partir de 390 px.

Stack: Next.js 16 (App Router) com TypeScript, Route Handlers e Server Actions,
PostgreSQL com Prisma 6, Auth.js v5, Tailwind CSS 4, shadcn/ui (Base UI),
Framer Motion e Zod com react-hook-form.

## Credenciais de teste

| Papel | E-mail                 | Senha                                         |
| ----- | ---------------------- | --------------------------------------------- |
| Aluno | `aluno@locatorlab.dev` | `Aluno@123`                                   |
| Admin | `admin@locatorlab.dev` | definida pelo professor em `ADMIN_PASSWORD`   |

A conta de aluno é pública de propósito: é a que os alunos usam nas aulas. A
senha do admin **não fica no código nem na documentação**. Ela vem da variável de
ambiente `ADMIN_PASSWORD` e é aplicada à conta `admin@locatorlab.dev` a cada
reset do banco. Para trocar a senha do admin, altere a variável e rode o reset.

O seed cria sempre os mesmos dados: 2 usuários e 30 tarefas (24 do aluno, ids 1
a 24; 6 do admin, ids 25 a 30). O aluno vê só as próprias tarefas; o admin vê e
gerencia as de todos. Qualquer pessoa pode criar uma conta de aluno em
`/register`.

## Como rodar localmente

Pré-requisitos: Node.js 20.9 ou superior e um banco PostgreSQL (um projeto
gratuito no [Neon](https://neon.tech) resolve).

```bash
# 1. Instale as dependências
npm install

# 2. Crie o arquivo de variáveis e preencha os valores
cp .env.example .env

# 3. Crie as tabelas
npm run db:deploy

# 4. Carregue os dados de teste
npm run db:seed

# 5. Suba o servidor
npm run dev
```

Acesse <http://localhost:3000> e entre com a conta de aluno ou com
`admin@locatorlab.dev` e a senha que você colocou em `ADMIN_PASSWORD`.

### Variáveis de ambiente

| Variável       | Para que serve                                                        |
| -------------- | --------------------------------------------------------------------- |
| `DATABASE_URL` | Conexão **com pool**, usada pela aplicação                            |
| `DIRECT_URL`   | Conexão **direta**, usada pelo Prisma nas migrations                  |
| `AUTH_SECRET`  | Segredo dos cookies de sessão e dos tokens da API (`npx auth secret`) |
| `RESET_KEY`    | Chave do endpoint de reset (`openssl rand -hex 24`)                   |
| `ADMIN_PASSWORD` | Senha da conta admin, mínimo de 8 caracteres (`openssl rand -base64 18`) |

Sem `ADMIN_PASSWORD`, o seed e o reset não rodam (e não apagam nada): a
mensagem de erro indica a variável que falta.

No Neon, as duas URLs ficam em **Connect**: com "Connection pooling" ligado é a
`DATABASE_URL` (host com `-pooler`); desligado é a `DIRECT_URL`. Com um
PostgreSQL local, use a mesma URL nas duas.

### Scripts

| Comando              | O que faz                                                  |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento                                |
| `npm run build`      | `prisma generate` + `prisma migrate deploy` + `next build` |
| `npm run start`      | Servidor de produção (depois do build)                     |
| `npm run lint`       | ESLint                                                     |
| `npm run typecheck`  | Checagem de tipos                                          |
| `npm run db:migrate` | Cria uma nova migration a partir do schema (dev)           |
| `npm run db:deploy`  | Aplica as migrations pendentes                             |
| `npm run db:seed`    | Recria usuários e tarefas do seed (mantém o Modo Bug)      |
| `npm run db:studio`  | Abre o Prisma Studio                                       |

Se o npm avisar que scripts de instalação foram bloqueados, as permissões dos
pacotes do Prisma e do esbuild já estão em `allowScripts` no `package.json`.

## Deploy na Vercel

### 1. Criar o banco (Neon)

1. Crie uma conta em <https://neon.tech> e um novo projeto (região próxima, por
   exemplo São Paulo).
2. Em **Connect**, copie as duas connection strings:
   - com **Connection pooling** ligado: será a `DATABASE_URL`;
   - com **Connection pooling** desligado: será a `DIRECT_URL`.

Com Supabase: em **Connect**, use o "Transaction pooler" (porta 6543, com
`?pgbouncer=true` no final) como `DATABASE_URL` e o "Session pooler" (porta 5432)
como `DIRECT_URL`.

### 2. Enviar o código para o GitHub

Crie um repositório vazio em <https://github.com/new> (sem README, `.gitignore`
ou licença) e envie o código:

```bash
git remote add origin https://github.com/SEU_USUARIO/locatorlab.git
git push -u origin main
```

### 3. Conectar o repositório na Vercel

1. Em <https://vercel.com/new>, importe o repositório.
2. Mantenha o preset **Next.js** e os comandos padrão. O script `build` já roda
   as migrations do Prisma.

### 4. Configurar as variáveis

Antes de clicar em Deploy, em **Environment Variables**, adicione:

| Nome           | Valor                                  |
| -------------- | -------------------------------------- |
| `DATABASE_URL` | connection string com pool             |
| `DIRECT_URL`   | connection string direta               |
| `AUTH_SECRET`  | resultado de `openssl rand -base64 32` |
| `RESET_KEY`    | resultado de `openssl rand -hex 24`    |
| `ADMIN_PASSWORD` | senha do admin, com pelo menos 8 caracteres (ex.: `openssl rand -base64 18`) |

Os valores de `AUTH_SECRET`, `RESET_KEY` e `ADMIN_PASSWORD` ficam só na Vercel.
Gere valores novos para cada ambiente e nunca os coloque no repositório, no
README ou em mensagens para os alunos. A `RESET_KEY` só deve ser compartilhada
com quem precisa restaurar o banco.

Com Prisma Postgres (integração do Vercel Marketplace), a integração cadastra a
`DATABASE_URL` sozinha. Cadastre a `DIRECT_URL` com a connection string direta
(`postgres://...`) copiada do Console do Prisma, em **Connect**; se houver uma só
string `postgres://`, use a mesma nas duas. Não use URLs `prisma+postgres://`.

### 5. Primeiro deploy e dados iniciais

1. Clique em **Deploy**. O build cria as tabelas no banco.
2. Carregue os dados do seed chamando o endpoint de reset:

```bash
curl -X POST https://SEU-PROJETO.vercel.app/api/v1/reset \
  -H "x-reset-key: $RESET_KEY"
```

   Antes, defina `RESET_KEY` no terminal com o valor cadastrado na Vercel
   (`export RESET_KEY="..."`), para a chave não ficar no histórico de comandos
   copiados.

3. Acesse o site com a conta de aluno ou com o admin e a senha de
   `ADMIN_PASSWORD`.

A partir daí, cada `git push` na `main` gera um novo deploy e aplica as
migrations novas automaticamente.

## Reset do banco

O reset apaga usuários e tarefas (inclusive contas criadas pelos alunos e
avatares) e recria exatamente os registros do seed, com os ids das tarefas
voltando a começar em 1. Use antes de cada aula ou no início da suíte de testes.

Há três formas de restaurar:

| Forma                 | Como                                                                       |
| --------------------- | -------------------------------------------------------------------------- |
| Painel Admin          | `/admin` › "Restaurar banco" › confirmar no diálogo                        |
| API (para as suítes)  | `POST /api/v1/reset` com o header `x-reset-key`                            |
| Linha de comando      | `npm run db:seed` (local, com o `.env` apontando para o banco)             |

```bash
curl -X POST http://localhost:3000/api/v1/reset -H "x-reset-key: $RESET_KEY"
```

Respostas da API: `200` (restaurado), `401` (chave ausente ou errada) e `500`
(`RESET_NOT_CONFIGURED` se falta a `RESET_KEY`, ou `ADMIN_PASSWORD_NOT_CONFIGURED`
se a `ADMIN_PASSWORD` está ausente ou curta; nesse caso nada é apagado).

A chave de reset é configurada pelo professor na variável `RESET_KEY` (na Vercel,
em **Settings › Environment Variables**). Nas suítes dos alunos, passe a chave
por variável de ambiente do framework, como nos exemplos abaixo, e não a escreva
no código do teste.

O reset **não altera o Modo Bug**. Assim, uma suíte que chama o reset no começo
não desliga o modo que o professor acabou de ligar.

Exemplos de uso nas suítes:

```js
// Cypress
beforeEach(() => {
  cy.request({ method: "POST", url: "/api/v1/reset", headers: { "x-reset-key": Cypress.env("RESET_KEY") } });
});

// Playwright
test.beforeEach(async ({ request }) => {
  await request.post("/api/v1/reset", { headers: { "x-reset-key": process.env.RESET_KEY } });
});
```

## Modo Bug

O Modo Bug liga seis defeitos propositais para **todos** os usuários, para os
alunos verem seus testes falharem e praticarem a leitura do erro.

### Como ligar e desligar

- **Pelo painel:** entre como admin, abra `/admin` e use o interruptor "Modo
  Bug". O painel lista cada defeito com um link para a tela onde ele aparece.
- **Pela API (somente admin):**

```bash
curl -X PUT "https://SEU-PROJETO.vercel.app/api/v1/admin/bug-mode" \
  -H "Authorization: Bearer $TOKEN_DO_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

`GET /api/v1/admin/bug-mode` mostra o estado atual. Para o aluno, as duas rotas
respondem 403.

### Os defeitos

| Nº | Id                        | Onde                                | O que acontece                                                        |
| -- | ------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| 1  | `task-save-not-persisted` | Tarefas › Editar                    | O aviso de sucesso aparece, mas a alteração não é gravada             |
| 2  | `cart-total`              | Assertions › Carrinho               | O total não soma o frete (R$ 379,70 em vez de R$ 399,70)              |
| 3  | `success-typo`            | Tarefas › Nova tarefa               | O aviso diz "Tarefa criada com suceso."                               |
| 4  | `deleted-item-stays`      | Tarefas › Excluir                   | A tarefa é apagada, mas a linha fica na lista até recarregar a página |
| 5  | `filter-extra-item`       | Assertions › Quantidade após filtro | O filtro por categoria traz um item de outra ("Periféricos" mostra 6) |
| 6  | `button-always-enabled`   | Localizadores › Botão condicional   | "Criar conta" fica habilitado e cria a conta sem validar              |

### Como se comporta

- **O aluno não vê nenhum aviso.** Só o admin vê o selo "Modo Bug ativo" no topo
  e o estado no painel.
- **Vale a partir do próximo carregamento de página.** Quem já está com um
  desafio aberto só passa a ver (ou deixa de ver) os bugs 2, 5 e 6 ao recarregar
  ou navegar. Os bugs de tarefas valem na ação seguinte.
- **A API REST de tarefas não tem bugs.** Os defeitos 1, 3 e 4 afetam só a
  interface; `/api/v1/tasks` continua correta e pode ser usada para preparar e
  conferir dados nos testes.
- **O reset não desliga o Modo Bug** (veja a seção anterior).

### Sugestão de aula

1. Os alunos escrevem e rodam os testes com o Modo Bug desligado (tudo passa).
2. O professor liga o Modo Bug.
3. Os alunos rodam a mesma suíte e investigam cada falha: qual assertion pegou o
   defeito, a mensagem de erro é clara, o teste falharia pelo motivo certo?
4. Discussão: quais testes deixaram passar um defeito? (Ex.: um teste que só
   confere o toast de sucesso não pega o bug 1.)

### Como adicionar um bug

Tudo parte de `src/lib/bugs/registry.ts`, que lista os bugs (id, título,
descrição, onde aparece e a chave `enabled`). O código de cada defeito consulta
essa lista pelo id:

- no servidor: `await isBugActive("id")`, de `src/lib/bugs/server.ts`;
- em componente cliente de um desafio: `useBug("id")`, de
  `src/components/bugs/bug-context.tsx`.

Para **adicionar** um bug, inclua uma entrada no registro e consulte o id no
ponto do código onde o defeito deve acontecer; ele aparece sozinho no painel.
Para **desligar** um bug sem apagar o código, troque `enabled` para `false`.
Para **achar** onde um bug é aplicado, busque pelo id no projeto.

## API REST

A referência completa, com parâmetros, exemplos de requisição e resposta e todos
os status codes, está no próprio site, em **Documentação da API** (`/api-docs`).
Os exemplos de curl de lá já vêm com o endereço do ambiente.

Resumo:

| Método e rota                   | Autenticação         | Status possíveis        |
| ------------------------------- | -------------------- | ----------------------- |
| `POST /api/v1/auth/login`       | nenhuma              | 200, 400, 401           |
| `GET /api/v1/tasks`             | Bearer ou cookie     | 200, 400, 401           |
| `POST /api/v1/tasks`            | Bearer ou cookie     | 201, 400, 401           |
| `GET /api/v1/tasks/{id}`        | Bearer ou cookie     | 200, 401, 403, 404      |
| `PUT /api/v1/tasks/{id}`        | Bearer ou cookie     | 200, 400, 401, 403, 404 |
| `PATCH /api/v1/tasks/{id}`      | Bearer ou cookie     | 200, 400, 401, 403, 404 |
| `DELETE /api/v1/tasks/{id}`     | Bearer ou cookie     | 204, 401, 403, 404      |
| `POST /api/v1/reset`            | header `x-reset-key` | 200, 401, 500           |
| `GET /api/v1/health`            | nenhuma              | 200, 503                |
| `GET /api/v1/avatars/{userId}`  | nenhuma              | 200 (imagem), 404       |
| `GET /api/v1/admin/users`       | somente admin        | 200, 401, 403           |
| `GET /api/v1/admin/bug-mode`    | somente admin        | 200, 401, 403           |
| `PUT /api/v1/admin/bug-mode`    | somente admin        | 200, 400, 401, 403      |

Todas as respostas JSON seguem o mesmo formato:

```json
{ "success": true, "data": {}, "meta": { "page": 1, "pageSize": 10, "total": 24, "totalPages": 3 } }
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos.",
    "details": [{ "field": "title", "message": "Informe o título." }]
  }
}
```

`meta` só aparece em listagens, e `details` só em erros de validação, com um
item por campo. Para autenticar, faça `POST /api/v1/auth/login`, guarde
`data.token` (válido por 24 horas) e envie `Authorization: Bearer <token>`. No
navegador, o cookie da sessão também é aceito.

## Convenção de data-testid

Formato kebab-case `area-elemento[-id]`, único em cada página. Exemplos:

| Elemento                  | data-testid                                            |
| ------------------------- | ------------------------------------------------------ |
| Campos de formulário      | `login-email-input`, `login-email-error`               |
| Botões                    | `login-submit-button`, `task-create-button`            |
| Erro geral do formulário  | `login-error-message`                                  |
| Linha e células da tabela | `task-row-12`, `task-title-12`, `task-status-badge-12` |
| Ações da linha            | `task-edit-button-12`, `task-delete-button-12`         |
| Filtros                   | `tasks-search-input`, `tasks-status-filter`            |
| Contagem e paginação      | `tasks-count`, `pagination-next`, `pagination-page-2`  |
| Estados                   | `tasks-loading`, `tasks-empty-state`, `error-state`    |
| Contadores do dashboard   | `dashboard-stat-total`, `dashboard-stat-total-value`   |
| Navegação                 | `nav-link-tasks`, `user-menu-trigger`, `logout-button` |
| Toasts                    | `toast-success`, `toast-error`                         |
| Logotipos                 | `sidebar-logo`, `topbar-logo`, `mobile-nav-logo`       |

As linhas da tabela de tarefas expõem `data-status` e `data-priority` para
assertions de atributo. Nos desafios de localizadores 2, 3, 5, 6 e 7 a área de
prática **não** tem `data-testid` (nem `id` e `name`, exceto os ids dinâmicos do
desafio 3), de propósito.

## Exercícios sugeridos

Os exercícios estão separados por nível e identificados por um código: **L** para
Desafios de Localizadores e **A** para Desafios de Assertions, seguido do número
do desafio (ex.: `L7` é o desafio 7 de localizadores, em
`/challenges/locators/nested-elements`). As respostas estão na seção
[Respostas esperadas](#respostas-esperadas).

Antes de começar, restaure o banco e confira se o Modo Bug está desligado. Todos
os exercícios podem ser feitos em Selenium, Cypress ou Playwright.

### Nível fácil

**L1. Id, name e classes simples** (`/challenges/locators/basic-attributes`)

- L1.1 Preencha Usuário com `maria` (localizando pelo id), E-mail com
  `maria@teste.com` (pelo name), escolha o país Portugal, marque a newsletter e
  clique em Salvar (pela classe). Qual é a mensagem de resultado?
- L1.2 Recarregue a página e clique em Salvar sem preencher nada. Qual é a
  mensagem?
- L1.3 Preencha os campos e clique em Limpar. Valide que os campos ficaram vazios,
  a newsletter desmarcada e confira a mensagem.

**L4. Elementos com data-testid** (`/challenges/locators/data-testid`)

- L4.1 Adicione o mouse uma vez e o teclado duas vezes. Valide a quantidade de
  itens, o total e a quantidade do teclado no carrinho.
- L4.2 Valide que "Esvaziar carrinho" começa desabilitado, habilita depois de
  adicionar um item e, ao ser clicado, mostra a mensagem de carrinho vazio.
- L4.3 Adicione só o headset. Qual é o total?

**L11. Botão que só habilita com o formulário válido** (`/challenges/locators/conditional-button`)

- L11.1 Valide que "Criar conta" começa desabilitado. Preencha nome `Ana`, e-mail
  `ana@teste.com`, senha `123456`, aceite os termos, valide que habilitou, clique
  e confira a mensagem.
- L11.2 Preencha tudo corretamente, mas com o nome `Al`. Quantos requisitos ficam
  com `data-valid="true"` e qual é o estado do botão?
- L11.3 No bloco "Ação perigosa", clique em Continuar antes de digitar. Depois
  digite `confirmar` (minúsculo) e, por fim, `CONFIRMAR`. Valide o
  `aria-disabled` e a mensagem em cada etapa.

**L13. Checkboxes, radio buttons e toggles** (`/challenges/locators/selection-controls`)

- L13.1 Marque E-mail e Push. Valide o resumo e o estado de "Selecionar todas".
- L13.2 Clique em "Selecionar todas". Quais canais ficam marcados? Qual o estado
  do WhatsApp?
- L13.3 Escolha o plano Equipe e valide que o anterior foi desmarcado e que
  "Corporativo" está desabilitado.
- L13.4 Desligue "Salvar automaticamente", ligue "Notificações sonoras", marque
  "Aceito receber ofertas" e valide a última linha do resumo.

**A1. Texto exato e texto parcial** (`/challenges/assertions/text`)

- A1.1 Valide o texto exato do título e do status do pedido.
- A1.2 Valide o selo de promoção. Compare o texto que o seu framework devolve com
  o que aparece na tela.
- A1.3 Valide que os termos contêm "3 dias úteis" e "30 dias".
- A1.4 Valide o valor do campo Usuário. Depois clique duas vezes em Seguir,
  validando o texto do botão e o contador a cada clique.
- A1.5 Digite `Olá QA` na bio e valide o contador. Tente digitar 100 caracteres:
  o que o contador mostra?

**A3. Estado: habilitado, marcado e selecionado** (`/challenges/assertions/state`)

- A3.1 Valide o estado inicial de todos os controles do formulário.
- A3.2 Valide que Salvar começa desabilitado. Troque o nome para `Maria S.`,
  salve e confira a mensagem. Volte o nome para `Maria Souza`: o que acontece com
  o botão?
- A3.3 Clique em "Bloquear formulário". Quais controles ficam desabilitados? As
  abas também?
- A3.4 Selecione a aba Cobrança e valide `aria-selected` nas três abas e o texto
  do painel.

**A6. Quantidade de itens após filtro** (`/challenges/assertions/list-count`)

- A6.1 Conte os itens sem filtro, com "Periféricos" e com "Periféricos" + "Somente
  em estoque".
- A6.2 Conte os itens de cada categoria e o total de produtos em estoque.
- A6.3 Busque por `mouse`, por `teclado` e por `xyz`. Valide a contagem e, no
  último, a mensagem.
- A6.4 Combine "Áudio" com "Somente em estoque". Quais produtos aparecem?

### Nível médio

**L2. Sem id: CSS e XPath relativos** (`/challenges/locators/relative-locators`)

- L2.1 Clique em Editar na linha de "Maria Souza" (sem pegar "Mariana Souza").
- L2.2 Exclua "João Pedro" e conte as linhas restantes.
- L2.3 Leia o e-mail de quem tem o papel Admin, partindo da célula "Admin".
- L2.4 Assine o plano Pro e valide a mensagem.

**L3. IDs dinâmicos** (`/challenges/locators/dynamic-ids`)

- L3.1 Preencha Usuário com `ana` e Código com `42`, confirme e valide a mensagem,
  usando seletores parciais de id.
- L3.2 Clique na "Opção B" e valide a mensagem.
- L3.3 Guarde o id do campo Usuário, recarregue a página e valide que ele mudou,
  mas continua começando com `user_`.

**L5. Só por texto ou role/ARIA** (`/challenges/locators/text-and-role`)

- L5.1 Clique em "Salvar" e em "Salvar e publicar" e valide as mensagens.
- L5.2 Favorite o documento e valide `aria-pressed` e a mensagem.
- L5.3 Preencha o título pelo label e valide que o cabeçalho mudou.
- L5.4 Ligue o "Modo foco", feche o aviso e abra a seção Relatórios, validando a
  mensagem de cada ação.

**L6. Listas e tabelas com itens repetidos** (`/challenges/locators/repeated-items`)

- L6.1 Adicione o "Teclado" e depois o "Mouse Gamer". Valide a mensagem do
  carrinho após cada clique.
- L6.2 Valide que o botão do "Teclado Mecânico RGB" está desabilitado.
- L6.3 Abra os detalhes do pedido da cliente "Ana" com o produto "Teclado".
- L6.4 Conte os pedidos com status "Pendente" e os pedidos cuja cliente é
  exatamente "Ana".

**L10. Esperas: aparece, some e muda de texto** (`/challenges/locators/waits`)

- L10.1 Clique em "Carregar dados" e espere a mensagem, sem sleep fixo. Valide
  também que o indicador "Carregando..." sumiu.
- L10.2 Clique em "Mostrar aviso", espere ele sumir e clique em Continuar.
- L10.3 Inicie o processamento e valide os três textos do status, na ordem, além
  do `data-state` final.

**L12. Dropdown nativo e customizado** (`/challenges/locators/dropdowns`)

- L12.1 Selecione Minas Gerais pelo texto visível e valide o valor e a mensagem.
- L12.2 Selecione Cypress e Playwright no select múltiplo.
- L12.3 No dropdown customizado, escolha "Robot Framework". Depois filtre por
  `app` e escolha a única opção.
- L12.4 Valide que não existe nenhum `[role="option"]` com o dropdown fechado.

**L14. Modal, alert, confirm e prompt** (`/challenges/locators/dialogs`)

- L14.1 Crie o projeto `Portal` pelo modal. Depois abra e cancele.
- L14.2 Dispare o alert, valide o texto e aceite.
- L14.3 Dispare o confirm duas vezes: aceite uma e cancele a outra.
- L14.4 Responda o prompt com `Maria`, depois cancele e depois envie vazio.

**L15. Menu que abre no hover** (`/challenges/locators/hover-menu`)

- L15.1 Escolha Produtos › Notebooks e Produtos › Acessórios › Fones.
- L15.2 Escolha Suporte › Fale conosco.
- L15.3 Valide o texto do tooltip do ícone de ajuda.
- L15.4 Clique no botão Baixar do cartão "Relatório mensal".

**L17. Upload de arquivo** (`/challenges/locators/file-upload`)

- L17.1 Clique em Enviar sem arquivo. Depois envie um arquivo de texto de 2048
  bytes chamado `relatorio.txt`.
- L17.2 Envie duas imagens no input múltiplo e valide a contagem.
- L17.3 Envie `contrato.pdf` pelo input escondido e depois `foto.png`.

**A2. Visibilidade e existência** (`/challenges/assertions/visibility`)

- A2.1 Para cada caixa (display, visibility, opacity, atributo hidden, removida),
  valide se ela existe no DOM e se está visível.
- A2.2 Clique em Mostrar na caixa "Removida do DOM" e valide que passou a existir;
  clique em Ocultar e valide que saiu do DOM.
- A2.3 Valide que o texto para leitores de tela existe e leia o conteúdo dele.

**A4. Atributos e classes CSS** (`/challenges/assertions/attributes-and-classes`)

- A4.1 Valide o e-mail vazio, depois `abc` e depois `ana@teste.com`. Em cada
  caso, confira classe, `aria-invalid`, `data-state`, cor da borda e mensagem.
- A4.2 Valide `href`, `target` e `rel` do link e `alt`, `width` e `height` da
  imagem.
- A4.3 Avance o progresso até o fim validando `aria-valuenow`, `data-status`, a
  largura da barra e a classe final.
- A4.4 Aprove o pedido e valide classes, `data-status` e texto do selo.

**A5. URL e título após navegação** (`/challenges/assertions/url-and-title`)

- A5.1 Valide o título inicial e o caminho.
- A5.2 Vá para "Meus pedidos" e abra os detalhes do pedido. Valide os parâmetros
  da URL, o hash e o título.
- A5.3 Volte para Início, clique em "Ir para pagamento" e valide a URL, o título e
  a mensagem do login. Depois use o botão Voltar.
- A5.4 Acesse direto a URL com `?section=perfil` e valide o título.

**A8. Mensagens de validação de formulário** (`/challenges/assertions/form-validation`)

- A8.1 Envie vazio e valide as seis mensagens e o resumo.
- A8.2 Provoque cada mensagem específica: nome curto, e-mail inválido, idade 17,
  idade 121, idade `abc`, senha curta, senha sem número e confirmação diferente.
- A8.3 Corrija campo por campo validando que o resumo diminui e o `aria-invalid`
  some.
- A8.4 Preencha tudo corretamente com o nome `Maria` e valide o sucesso.

### Nível difícil

**L7. Elementos aninhados profundamente** (`/challenges/locators/nested-elements`)

- L7.1 Aprove "Revisar contrato" em Engenharia › Backend › Portal e valide que
  só ela mudou.
- L7.2 Quantas tarefas "Revisar contrato" existem? E quantas tarefas há no
  departamento Engenharia e no total?
- L7.3 Aprove "Aprovar orçamento" em Marketing › Conteúdo › Campanha de
  lançamento.

**L8. Iframe com formulário** (`/challenges/locators/iframe`)

- L8.1 Assine a newsletter fora do iframe com `n@teste.com`.
- L8.2 Dentro do iframe, envie o formulário vazio e valide o erro.
- L8.3 Preencha `Maria`, `maria@teste.com` e o curso Cypress, envie e valide.
  Volte para a página principal e valide de novo a mensagem da newsletter.

**L9. Shadow DOM** (`/challenges/locators/shadow-dom`)

- L9.1 Aplique o cupom `locator10` (minúsculo) e valide.
- L9.2 Aplique `abc` e depois tente aplicar com o campo vazio.
- L9.3 Clique em "Confirmar pedido", no shadow root aninhado.

**L16. Drag and drop** (`/challenges/locators/drag-and-drop`)

- L16.1 Mova "Escrever testes" para "Em andamento" e "Revisar PR" para
  "Concluído". Valide os três contadores.
- L16.2 Solte a ficha fora da área de destino e depois dentro dela.

**L18. Abas e janelas novas** (`/challenges/locators/new-tabs`)

- L18.1 Abra o comprovante pelo link, valide o título da nova aba e o código,
  confirme a leitura e volte para a aba original.
- L18.2 Repita pelo pop-up e feche a janela pelo botão "Fechar janela".

**L19. Tabela paginada e ordenável** (`/challenges/locators/paginated-table`)

- L19.1 Valide a primeira página: quantidade de linhas, texto de paginação e
  estado do botão Anterior.
- L19.2 Ordene por Salário (decrescente) e valide os dois primeiros. Ordene
  crescente e valide o primeiro.
- L19.3 Sem ordenar, encontre "Rafael Santos" navegando pelas páginas e clique em
  Selecionar. Em qual página ele está?
- L19.4 Mude para 10 por página e valide o número de páginas e de linhas na
  última.
- L19.5 Filtre por "Analista de QA" e por "São Paulo".

**A7. Valores calculados: carrinho de compras** (`/challenges/assertions/cart-totals`)

- A7.1 Valide o estado inicial e aplique `QA10`.
- A7.2 Sem cupom, aumente o teclado para 2 unidades e valide. Aplique `QA10`.
- A7.3 Volte ao estado inicial e aumente o mousepad para 3, 4 e 5 unidades. Em
  qual quantidade o frete fica grátis? Valide o total em cada passo.
- A7.4 Aplique `FRETEGRATIS` no estado inicial e depois um cupom inexistente.
- A7.5 Remova todos os itens e valide o carrinho vazio.

**A9. Ordenação: alfabética e por data** (`/challenges/assertions/sorting`)

- A9.1 Ordene por "Nome (A–Z)" e valide a sequência comparando com uma cópia
  ordenada no próprio teste.
- A9.2 Mostre que um `.sort()` sem suporte a acentos daria uma ordem diferente.
- A9.3 Ordene por "Data (mais antiga)" usando o atributo `datetime` na
  comparação.

**A10. Respostas de API** (`/challenges/assertions/api-responses`)

- A10.1 Login com senha errada e login sem senha: valide status, `error.code` e
  `error.details`.
- A10.2 Listagem com `pageSize=3&sort=oldest`: valide status, quantidade de itens,
  id do primeiro e todo o `meta`.
- A10.3 Listagem com `status=DONE&pageSize=50`: valide que todos os itens estão
  concluídos e quantos são.
- A10.4 Busque as tarefas 1, 999999 e 25 (logado como aluno).
- A10.5 Crie uma tarefa só com título, altere com PATCH, substitua com PUT e
  exclua, validando cada resposta e o 404 final.
- A10.6 Chame a listagem sem token e sem cookie.

## Respostas esperadas

As respostas supõem o banco restaurado e o Modo Bug desligado. Os textos são
exatos, incluindo a pontuação.

### Localizadores

**L1**
- L1.1 `Cadastro salvo: maria (maria@teste.com), Portugal, newsletter: sim.`
  (em `#result-message`).
- L1.2 `Preencha usuário e e-mail para salvar.`
- L1.3 Campos com valor vazio, `#newsletter` desmarcado e
  `Formulário limpo.`

**L2**
- L2.1 `Editando: Maria Souza`. XPath:
  `//tr[td[normalize-space()="Maria Souza"]]//button[normalize-space()="Editar"]`.
- L2.2 4 linhas no `tbody`; mensagem `Excluído: João Pedro`.
- L2.3 `ana.lima@empresa.com`. XPath:
  `//td[normalize-space()="Admin"]/preceding-sibling::td[1]`.
- L2.4 `Plano assinado: Pro (R$ 49/mês)`.

**L3**
- L3.1 `Confirmado: ana com o código 42.` Seletores: `[id^="user_"]`,
  `[id$="_code"]`, `[id*="_confirm"]`.
- L3.2 `Você escolheu a Opção B.` (localize pelo texto: o id é totalmente
  aleatório).
- L3.3 O id muda a cada carregamento (`user_` seguido de 6 caracteres
  hexadecimais).

**L4**
- L4.1 `cart-count` = `3`, `cart-total` = `R$ 587,00`,
  `cart-item-quantity-keyboard` = `2x`.
- L4.2 `clear-cart` desabilitado → habilitado → `cart-empty-message` com
  `Seu carrinho está vazio.`
- L4.3 `R$ 179,00`.

**L5**
- L5.1 `Documento salvo.` e `Documento salvo e publicado.` Use nome exato:
  `getByRole("button", { name: "Salvar", exact: true })`.
- L5.2 `aria-pressed="true"` e `Adicionado aos favoritos.`
- L5.3 O `h3` passa a mostrar o título digitado.
- L5.4 `Modo foco ligado.` (switch com `aria-checked="true"`), `Aviso fechado.`
  (nenhum `[role="alert"]` na área) e `Seção aberta: Relatórios` (o link fica com
  `aria-current="page"`).

**L6**
- L6.1 `Carrinho: 1 item. Último adicionado: Teclado.` e depois
  `Carrinho: 2 itens. Último adicionado: Mouse Gamer.`
- L6.2 Desabilitado (produto esgotado).
- L6.3 `Pedido #1004: Teclado para Ana (Pendente).` XPath:
  `//tr[td[2][normalize-space()="Ana"] and td[3][normalize-space()="Teclado"]]//button`.
- L6.4 4 pendentes (#1002, #1003, #1004, #1007). 4 pedidos da "Ana" exata
  (#1001, #1002, #1004, #1008); "Ana Paula" não conta.

**L7**
- L7.1 `Aprovada: Engenharia › Backend › Portal › Revisar contrato`; só um
  `.task-status` com `Aprovada`; o botão dessa tarefa fica desabilitado.
- L7.2 3 tarefas "Revisar contrato"; 6 no departamento Engenharia; 9 no total.
- L7.3 `Aprovada: Marketing › Conteúdo › Campanha de lançamento › Aprovar orçamento`.

**L8**
- L8.1 `Newsletter assinada para n@teste.com.` (em `#newsletter-result`, fora do
  iframe).
- L8.2 `Preencha nome, e-mail e curso.` (em `#error-message`, dentro do iframe).
- L8.3 `Inscrição enviada! Maria (maria@teste.com) no curso Cypress.` (em
  `#success-message`, dentro do iframe). A mensagem da newsletter continua igual.

**L9**
- L9.1 `Cupom aplicado: 10% de desconto.` (o cupom não diferencia maiúsculas).
- L9.2 `Cupom inválido: ABC.` e `Digite um cupom.`
- L9.3 `Pedido confirmado!` (em `#order-result`).

**L10**
- L10.1 `Dados carregados com sucesso!` (em `#delayed-message`, cerca de 3 s);
  `#loading-indicator` não existe mais.
- L10.2 O aviso `Salvando alterações, aguarde...` sai do DOM em cerca de 4 s;
  depois disso Continuar habilita e mostra `Você continuou depois do aviso.`
- L10.3 `Na fila` → `Processando...` (cerca de 2 s) → `Concluído` (cerca de 5 s);
  `data-state="done"`.

**L11**
- L11.1 Desabilitado → habilitado → `Conta criada com sucesso para Ana!`
- L11.2 3 requisitos válidos (o do nome fica com `data-valid="false"`); botão
  desabilitado.
- L11.3 `aria-disabled="true"` e `Botão bloqueado: digite CONFIRMAR primeiro.`;
  com `confirmar` continua `true` (diferencia maiúsculas); com `CONFIRMAR` vira
  `false` e o clique mostra `Ação executada com sucesso.`

**L12**
- L12.1 Valor `MG`; `Estado selecionado: Minas Gerais (MG)`.
- L12.2 `Selecionadas (2): Cypress, Playwright`.
- L12.3 `Framework selecionado: Robot Framework`; com o filtro `app` sobra 1
  opção, e o resultado vira `Framework selecionado: Appium`.
- L12.4 0 opções no DOM.

**L13**
- L13.1 `Notificações: E-mail, Push`; "Selecionar todas" com
  `indeterminate === true`.
- L13.2 E-mail, SMS e Push marcados; WhatsApp desmarcado e desabilitado;
  `Notificações: E-mail, SMS, Push`.
- L13.3 `Plano: Equipe`; Gratuito desmarcado; Corporativo desabilitado.
- L13.4 `Salvar automaticamente: desligado · Notificações sonoras: ligado · Ofertas: sim`.

**L14**
- L14.1 `Projeto criado: Portal` e depois `Criação de projeto cancelada.`
- L14.2 Texto do alert: `Operação concluída com sucesso!`; resultado
  `Alert fechado.`
- L14.3 `Confirm aceito: registro excluído.` e
  `Confirm cancelado: nada foi excluído.`
- L14.4 `Olá, Maria!`, `Prompt cancelado.` e `Prompt enviado sem nome.`

**L15**
- L15.1 `Você escolheu: Produtos › Notebooks` e
  `Você escolheu: Produtos › Acessórios › Fones`.
- L15.2 `Você escolheu: Suporte › Fale conosco`.
- L15.3 `Entrega em até 5 dias úteis para todo o Brasil.`
- L15.4 `Download iniciado: Relatório mensal`.

**L16**
- L16.1 Contadores: A fazer `1`, Em andamento `1`, Concluído `1`. Mensagens
  `"Escrever testes" movido para "Em andamento".` e
  `"Revisar PR" movido para "Concluído".`
- L16.2 `Ficha solta fora da área: ela voltou para a origem.` e
  `Ficha solta na área de destino!` (`#drop-zone` com `data-filled="true"`).

**L17**
- L17.1 `Selecione um arquivo antes de enviar.` e
  `Upload concluído: relatorio.txt (2,0 KB)`.
- L17.2 `2 arquivos selecionados`, com 2 itens em `#multiple-files-list`.
- L17.3 `Documento recebido: contrato.pdf` e depois
  `Formato inválido: foto.png. Envie um arquivo PDF.`
  (`#document-result` com `data-valid="false"`).

**L18**
- L18.1 Título da nova aba: `Comprovante de inscrição · LocatorLab`; código
  `LL-2048`; na aba original:
  `Confirmação recebida: comprovante LL-2048 (via nova aba).`
- L18.2 `Confirmação recebida: comprovante LL-2048 (via pop-up).` e
  `data-confirmations="2"`; a janela pop-up fecha.

**L19**
- L19.1 5 linhas; `Mostrando 1–5 de 24`; `#previous-page` desabilitado.
- L19.2 Decrescente: Sofia Teixeira (R$ 12.000) e Camila Duarte (R$ 11.500);
  crescente: Vinícius Werneck (R$ 2.000).
- L19.3 Página 4 (ids 16 a 20). `Selecionado: Rafael Santos (ID 18), Desenvolvedor Backend.`
- L19.4 3 páginas; 4 linhas na última (`Mostrando 21–24 de 24`).
- L19.5 "Analista de QA": 4 (Ana Beatriz Lima, Eduarda Farias, Karina Lopes,
  Úrsula Vieira). "São Paulo": 4 (Ana Beatriz Lima, Felipe Gomes, Lucas Moreira,
  Rafael Santos).

### Assertions

**A1**
- A1.1 `Bem-vindo, Maria Souza!` e `Pedido nº 4821 confirmado`. O HTML do status
  tem espaços e quebra de linha a mais: o `have.text` do Cypress precisa de
  normalização, enquanto o `toHaveText` do Playwright e o `getText()` do Selenium
  já normalizam.
- A1.2 Texto no HTML: `Promoção relâmpago`; na tela (CSS `uppercase`):
  `PROMOÇÃO RELÂMPAGO`. O `getText()` do Selenium devolve a versão em
  maiúsculas.
- A1.3 Os dois trechos estão no texto.
- A1.4 Valor `maria.souza`. Botão `Seguindo` com `129 seguidores`; no segundo
  clique, `Seguir` com `128 seguidores`.
- A1.5 `6/80 caracteres`; com 100 caracteres o campo aceita só 80 e mostra
  `80/80 caracteres`.

**A2**
- A2.1 display, visibility e hidden: existem e não estão visíveis. Removida: não
  existe. Opacity 0: existe; o Cypress considera não visível, e Playwright e
  Selenium consideram visível.
- A2.2 A caixa passa a existir (`#box-removed`) e o botão vira `Ocultar`; ao
  ocultar, `#box-removed` sai do DOM.
- A2.3 `#sr-only-text` existe, com o texto ` (status atualizado em 12/03/2025)`.

**A3**
- A3.1 "Lembrar de mim" marcado, "Receber novidades" desmarcado, frequência
  "Semanal" (`#frequency-weekly`), idioma `pt-BR` ("Português (Brasil)"), "Código
  da conta" com `readonly` e habilitado, aba Geral com `aria-selected="true"`.
- A3.2 `Preferências salvas para Maria S.`; com o nome de volta para
  `Maria Souza`, o botão volta a ficar desabilitado.
- A3.3 Todos os controles do formulário (o `fieldset` inteiro); `#lock-status`
  mostra `Formulário bloqueado`. As abas não são afetadas.
- A3.4 `false`, `false`, `true`; painel: `Plano atual e forma de pagamento.`

**A4**
- A4.1 Vazio: classe `input-error`, `aria-invalid="true"`, `data-state="error"`,
  borda `rgb(220, 38, 38)`, mensagem `Informe o e-mail.` `abc`: mesmo estado,
  mensagem `E-mail inválido.` Válido: classe `input-success`,
  `aria-invalid="false"`, `data-state="success"`, borda `rgb(22, 163, 74)`,
  mensagem `E-mail válido.`
- A4.2 `https://playwright.dev/docs/locators`, `_blank`, `noopener noreferrer`;
  `Foto de perfil de Maria Souza`, `48`, `48`.
- A4.3 `aria-valuenow` 0 → 25 → 50 → 75 → 100; `data-status` `idle` →
  `in-progress` → `complete`; largura `25%`…`100%`; classe `progress-complete` e
  rótulo `100% concluído` no final, com Avançar desabilitado.
- A4.4 `badge-approved` (sem `badge-pending`), `data-status="approved"`, texto
  `Aprovado`.

**A5**
- A5.1 `Início | Loja Demo · LocatorLab`; caminho
  `/challenges/assertions/url-and-title`.
- A5.2 `section=pedidos`, `pedido=4821`, hash `#detalhes`; título
  `Meus pedidos | Loja Demo · LocatorLab`.
- A5.3 `section=login` e `from=pagamento`; título
  `Entrar | Loja Demo · LocatorLab`; mensagem
  `Faça login para continuar para o pagamento.` O Voltar retorna ao caminho sem
  query string.
- A5.4 `Meu perfil | Loja Demo · LocatorLab`.

**A6**
- A6.1 12, 5 e 4.
- A6.2 Periféricos 5, Áudio 3, Monitores 2, Acessórios 2; 9 em estoque.
- A6.3 `mouse`: 3 (Mouse gamer, Mouse sem fio, Mousepad grande); `teclado`: 2;
  `xyz`: 0, com `Nenhum produto encontrado com esses filtros.`
- A6.4 Headset com microfone e Caixa de som.

**A7**
- A7.1 3 itens, subtotal `R$ 379,70`, frete `R$ 20,00`, total `R$ 399,70`. Com
  `QA10`: desconto `- R$ 37,97`, total `R$ 361,73`.
- A7.2 4 itens, subtotal `R$ 629,60`, frete `Grátis`, total `R$ 629,60`. Com
  `QA10`: desconto `- R$ 62,96`, total `R$ 566,64`.
- A7.3 3 mousepads: total `R$ 479,50`; 4: `R$ 519,40` (ainda paga frete); 5:
  `R$ 539,30`, com frete grátis (subtotal de R$ 539,30, acima de R$ 500,00).
- A7.4 Frete `Grátis` e total `R$ 379,70`; cupom inexistente:
  `Cupom inválido: NATAL50.` (o cupom anterior continua ativo).
- A7.5 `#empty-cart` com `Seu carrinho está vazio.`; todos os valores
  `R$ 0,00` e `0 itens`.

**A8**
- A8.1 `Informe o nome.`, `Informe o e-mail.`, `Informe a idade.`,
  `Informe a senha.`, `Confirme a senha.`, `Você precisa aceitar os termos.`;
  resumo `Corrija 6 campos para continuar.`
- A8.2 `O nome deve ter pelo menos 3 caracteres.`, `E-mail inválido.`,
  `Você deve ter pelo menos 18 anos.`, `Idade inválida.`,
  `A idade deve ser um número inteiro.`,
  `A senha deve ter pelo menos 8 caracteres.`,
  `A senha deve conter pelo menos um número.`, `As senhas não coincidem.`
- A8.3 O resumo diminui um a um até `Corrija 1 campo para continuar.` e depois
  some.
- A8.4 `Cadastro enviado com sucesso, Maria!`

**A9**
- A9.1 Álvaro Dias, Bruno Alves, Carla Mendes, Daniel Costa, Érica Santos, Fábio
  Lima, Helena Prado, Zélia Rocha. Compare com
  `[...nomes].sort((a, b) => a.localeCompare(b, "pt-BR"))`.
- A9.2 O `.sort()` puro coloca "Álvaro Dias" e "Érica Santos" depois de "Zélia
  Rocha".
- A9.3 25/12/2021, 09/07/2022, 28/02/2023, 02/11/2023, 20/01/2024, 05/03/2024,
  15/03/2024, 01/10/2024.

**A10**
- A10.1 Senha errada: 401, `INVALID_CREDENTIALS`,
  `E-mail ou senha incorretos.` Sem senha: 400, `VALIDATION_ERROR`, `details` com
  o campo `password`.
- A10.2 200; 3 itens; primeiro id `1`; `meta` = `{ page: 1, pageSize: 3,
  total: 24, totalPages: 8 }`.
- A10.3 8 tarefas, todas com `status: "DONE"`.
- A10.4 Tarefa 1: 200, título `Instalar o Node.js e o VS Code`. 999999: 404,
  `NOT_FOUND`, `Tarefa não encontrada.` 25: 403, `FORBIDDEN`.
- A10.5 POST: 201, `status: "PENDING"`, `priority: "MEDIUM"`, `id` numérico.
  PATCH `{ "status": "DONE" }`: 200, `completedAt` preenchido. PUT
  `{ "title": "Novo título" }`: 200, `description` e `dueDate` nulos. DELETE: 204
  sem corpo; GET em seguida: 404.
- A10.6 401, `UNAUTHORIZED`.

### Com o Modo Bug ligado

Os exercícios abaixo passam a falhar de propósito:

| Exercício                    | O que muda                                                          |
| ---------------------------- | ------------------------------------------------------------------- |
| L11.1, L11.2                 | "Criar conta" já começa habilitado e cria a conta com dados inválidos |
| A6.1, A6.2, A6.4             | Cada filtro de categoria traz um produto a mais                     |
| A7.1 e A7.3 (3 e 4 unidades) | O total não soma o frete. Com frete grátis (A7.2, A7.4 e 5 unidades em A7.3) o total continua certo, o que é bom para discutir cobertura |
| Testes da tela de Tarefas    | Editar não grava, criar mostra "suceso" e excluir não remove a linha |

## Estrutura do projeto

```
prisma/                      schema, migrations e seed
src/app/(auth)/              login e cadastro
src/app/(app)/               área logada: dashboard, tarefas, perfil, desafios,
                             documentação da API e painel admin
src/app/api/v1/              API REST
src/app/embed/               páginas auxiliares dos desafios (iframe e nova aba)
src/actions/                 Server Actions (auth, tarefas, perfil, admin)
src/components/ui/           componentes do shadcn/ui
src/components/challenges/   catálogo, página de desafio, dica e os componentes
                             dos desafios (locators/ e assertions/)
src/components/api-docs/     página de documentação da API
src/components/admin/        painel do professor
src/lib/                     prisma, auth, validações Zod, tarefas, respostas da API
src/lib/challenges/          textos dos desafios (títulos, níveis, objetivos e dicas)
src/lib/bugs/                registro central do Modo Bug
src/lib/api-docs.ts          conteúdo da documentação da API
src/proxy.ts                 protege as rotas da área logada
```

Para criar um desafio novo: adicione os textos em `src/lib/challenges/locators.ts`
(ou `assertions.ts`), crie o componente em `src/components/challenges/locators/`
(ou `assertions/`) e registre-o no `index.ts` da mesma pasta.

### Notas técnicas

- O `cacheComponents` do Next.js está desligado de propósito: ele mantém a
  página anterior escondida no DOM, o que duplicaria elementos e atrapalharia os
  localizadores.
- O avatar é guardado no próprio banco (até 1 MB), então o reset também o remove
  e não é preciso configurar um serviço de arquivos.
- Os desafios usam HTML puro em vez dos componentes do shadcn/ui, para controlar
  exatamente quais atributos cada elemento tem.
- Os valores em reais dos desafios são escritos como `R$ 1.234,56`, com espaço
  comum, para o texto ser idêntico em qualquer navegador.
