# LocatorLab

Ambiente de prática para aulas de automação de testes. Os alunos treinam
**localizadores** (id, name, class, CSS, XPath, data-testid, texto, role/ARIA) e
**assertions** (texto, visibilidade, estado, atributos, URL, quantidade de itens,
respostas de API) usando Selenium, Cypress e Playwright.

Etapas concluídas (4 de 5):

1. Autenticação, dashboard, CRUD de tarefas, perfil, papéis, API REST, reset do
   banco e layout base.
2. Desafios de Localizadores: catálogo com filtro por nível e 19 desafios
   interativos.
3. Desafios de Assertions: catálogo com filtro por nível e 10 desafios
   interativos, incluindo um console para as respostas da API.
4. Painel do professor (somente admin) e Modo Bug: seis defeitos propositais
   que o professor liga para os alunos verem seus testes falharem.

## Credenciais de teste

| Papel | E-mail                 | Senha       |
| ----- | ---------------------- | ----------- |
| Aluno | `aluno@locatorlab.dev` | `Aluno@123` |
| Admin | `admin@locatorlab.dev` | `Admin@123` |

O seed cria sempre os mesmos dados: 2 usuários e 30 tarefas (24 do aluno, IDs 1
a 24; 6 do admin, IDs 25 a 30). O aluno vê só as próprias tarefas; o admin vê e
gerencia as de todos.

## Stack

- Next.js 16 (App Router) + TypeScript
- Route Handlers (API REST) e Server Actions
- PostgreSQL (Neon ou Supabase) + Prisma 6
- Auth.js v5 (NextAuth) com e-mail e senha, sessão em JWT
- Tailwind CSS 4, shadcn/ui (Base UI) e Framer Motion
- Zod para validação no front e no back, com react-hook-form

## Rodando localmente

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

Acesse <http://localhost:3000> e entre com uma das credenciais de teste.

### Variáveis de ambiente

| Variável       | Para que serve                                                            |
| -------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL` | Conexão **com pool**, usada pela aplicação                                |
| `DIRECT_URL`   | Conexão **direta**, usada pelo Prisma nas migrations                      |
| `AUTH_SECRET`  | Segredo dos cookies de sessão e dos tokens da API (`npx auth secret`)     |
| `RESET_KEY`    | Chave do endpoint de reset (`openssl rand -hex 24`)                       |

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
| `npm run db:seed`    | Apaga tudo e recria os dados do seed                       |
| `npm run db:studio`  | Abre o Prisma Studio                                       |

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

```bash
git add .
git commit -m "LocatorLab - etapa 1"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/locatorlab.git
git push -u origin main
```

### 3. Conectar o repositório na Vercel

1. Em <https://vercel.com/new>, importe o repositório.
2. Mantenha o preset **Next.js** e os comandos padrão. O script `build` já roda
   as migrations do Prisma.

### 4. Configurar as variáveis

Antes de clicar em Deploy, em **Environment Variables**, adicione:

| Nome           | Valor                                      |
| -------------- | ------------------------------------------ |
| `DATABASE_URL` | connection string com pool                 |
| `DIRECT_URL`   | connection string direta                   |
| `AUTH_SECRET`  | resultado de `openssl rand -base64 32`     |
| `RESET_KEY`    | resultado de `openssl rand -hex 24`        |

### 5. Primeiro deploy e dados iniciais

1. Clique em **Deploy**. O build cria as tabelas no banco.
2. Carregue os dados do seed chamando o endpoint de reset:

```bash
curl -X POST https://SEU-PROJETO.vercel.app/api/v1/reset \
  -H "x-reset-key: SUA_RESET_KEY"
```

3. Acesse o site e entre com as credenciais de teste.

A partir daí, cada `git push` na `main` gera um novo deploy e aplica as
migrations novas automaticamente.

## Reset do banco

`POST /api/v1/reset` apaga usuários e tarefas (inclusive contas criadas pelos
alunos e avatares) e recria exatamente os registros do seed, com os IDs das tarefas
voltando a começar em 1. Use antes de cada aula ou no `before` da suíte de
testes.

```bash
curl -X POST http://localhost:3000/api/v1/reset -H "x-reset-key: $RESET_KEY"
```

Respostas: `200` (restaurado), `401` (chave ausente ou errada), `500` (a
variável `RESET_KEY` não foi configurada no servidor).

## API REST

Base: `/api/v1`. Todas as respostas seguem o mesmo formato:

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

`meta` só aparece em listagens e `details` só em erros de validação, com um item por campo (a primeira regra que
falhou).

| Método e rota                 | Autenticação         | Status possíveis             |
| ----------------------------- | -------------------- | ---------------------------- |
| `POST /auth/login`            | nenhuma              | 200, 400, 401                |
| `GET /tasks`                  | Bearer ou cookie     | 200, 400, 401                |
| `POST /tasks`                 | Bearer ou cookie     | 201, 400, 401                |
| `GET /tasks/:id`              | Bearer ou cookie     | 200, 401, 403, 404           |
| `PUT /tasks/:id`              | Bearer ou cookie     | 200, 400, 401, 403, 404      |
| `PATCH /tasks/:id`            | Bearer ou cookie     | 200, 400, 401, 403, 404      |
| `DELETE /tasks/:id`           | Bearer ou cookie     | 204, 401, 403, 404           |
| `POST /reset`                 | header `x-reset-key` | 200, 401, 500                |
| `GET /health`                 | nenhuma              | 200, 503                     |
| `GET /avatars/:userId`        | nenhuma              | 200 (imagem), 404            |

Códigos de erro (`error.code`): `VALIDATION_ERROR`, `INVALID_JSON`,
`INVALID_CREDENTIALS`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`,
`RESET_NOT_CONFIGURED`, `SERVICE_UNAVAILABLE`, `INTERNAL_ERROR`.

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@locatorlab.dev","password":"Aluno@123"}'
```

A resposta traz `data.token` (JWT válido por 24 horas). Envie-o nas demais
chamadas no header `Authorization: Bearer <token>`. Sem esse header, a API usa
o cookie de sessão do navegador.

### Tarefas

Parâmetros de `GET /tasks`:

| Parâmetro  | Valores                                              | Padrão   |
| ---------- | ---------------------------------------------------- | -------- |
| `page`     | inteiro a partir de 1                                | `1`      |
| `pageSize` | inteiro de 1 a 50                                    | `10`     |
| `search`   | texto buscado no título e na descrição               | vazio    |
| `status`   | `PENDING`, `IN_PROGRESS`, `DONE`                     | todos    |
| `priority` | `LOW`, `MEDIUM`, `HIGH`                              | todas    |
| `sort`     | `newest`, `oldest`, `dueDate`, `title`, `priority`   | `newest` |

Corpo de `POST` e `PUT` (só `title` é obrigatório):

```json
{
  "title": "Estudar seletores CSS",
  "description": "Combinadores e pseudo-classes",
  "status": "PENDING",
  "priority": "HIGH",
  "dueDate": "2030-03-01"
}
```

- `PUT` substitui a tarefa inteira: campos opcionais não enviados voltam ao
  padrão (`status: PENDING`, `priority: MEDIUM`, sem descrição e sem prazo).
- `PATCH` altera só os campos enviados (pelo menos um).
- Tarefa de outro usuário devolve `403`; ID inexistente devolve `404`.

```bash
TOKEN="cole-o-token-aqui"

curl "http://localhost:3000/api/v1/tasks?status=PENDING&pageSize=5" \
  -H "Authorization: Bearer $TOKEN"

curl -X PATCH http://localhost:3000/api/v1/tasks/5 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'
```

## Desafios de Localizadores

O catálogo fica em `/challenges/locators` e aceita o filtro `?level=easy`,
`medium` ou `hard`. Cada desafio tem sua página em
`/challenges/locators/{slug}`, com descrição, lista do que localizar, área de
prática, botão "Reiniciar desafio" e um bloco "Dica" recolhível.

| Nº | Slug                 | Desafio                                    | Nível   |
| -- | -------------------- | ------------------------------------------ | ------- |
| 1  | `basic-attributes`   | Id, name e classes simples                 | Fácil   |
| 2  | `relative-locators`  | Sem id: CSS e XPath relativos              | Médio   |
| 3  | `dynamic-ids`        | IDs dinâmicos                              | Médio   |
| 4  | `data-testid`        | Elementos com data-testid                  | Fácil   |
| 5  | `text-and-role`      | Só por texto ou role/ARIA                  | Médio   |
| 6  | `repeated-items`     | Listas e tabelas com itens repetidos       | Médio   |
| 7  | `nested-elements`    | Elementos aninhados profundamente          | Difícil |
| 8  | `iframe`             | Iframe com formulário                      | Difícil |
| 9  | `shadow-dom`         | Shadow DOM                                 | Difícil |
| 10 | `waits`              | Esperas: aparece, some e muda de texto     | Médio   |
| 11 | `conditional-button` | Botão que só habilita com formulário válido | Fácil  |
| 12 | `dropdowns`          | Dropdown nativo e customizado              | Médio   |
| 13 | `selection-controls` | Checkboxes, radio buttons e toggles        | Fácil   |
| 14 | `dialogs`            | Modal, alert, confirm e prompt             | Médio   |
| 15 | `hover-menu`         | Menu que abre no hover                     | Médio   |
| 16 | `drag-and-drop`      | Drag and drop                              | Difícil |
| 17 | `file-upload`        | Upload de arquivo                          | Médio   |
| 18 | `new-tabs`           | Abas e janelas novas                       | Difícil |
| 19 | `paginated-table`    | Tabela paginada e ordenável                | Difícil |

Regras seguidas pelos desafios:

- **Sem atalhos nos desafios 2, 3, 5, 6 e 7.** A área de prática deles não tem
  `data-testid` nem `name` em nenhum elemento, e nos desafios 2, 5, 6 e 7 também
  não há `id`. O desafio 3 tem ids, mas eles mudam a cada carregamento.
- **Conteúdo determinístico.** Os dados e os tempos são fixos (no desafio 10:
  3 s para aparecer, 4 s para sumir, mudança de texto aos 2 s e aos 5 s). A
  única exceção é o desafio 3, cujos ids são gerados a cada carregamento.
- **Nada é gravado.** Os desafios rodam só no navegador: recarregar a página ou
  clicar em "Reiniciar desafio" volta ao estado inicial, e o upload do desafio
  17 não envia o arquivo para o servidor.
- Os desafios usam HTML puro em vez dos componentes do shadcn/ui, para
  controlar exatamente quais atributos cada elemento tem.

Duas páginas auxiliares ficam em `/embed` (sem menu, mas exigem login):
`/embed/iframe-form` é o conteúdo do iframe do desafio 8 e `/embed/new-tab` é a
página aberta em outra aba pelo desafio 18.

Para criar um desafio novo: adicione os textos em
`src/lib/challenges/locators.ts` (ou `assertions.ts`), crie o componente em
`src/components/challenges/locators/` (ou `assertions/`) e registre-o no
`index.ts` da mesma pasta.

## Desafios de Assertions

O catálogo fica em `/challenges/assertions` e funciona como o de localizadores:
filtro `?level=`, uma página por desafio em `/challenges/assertions/{slug}`,
lista "O que validar", área de prática, "Reiniciar desafio" e "Dica" recolhível.

| Nº | Slug                     | Desafio                                   | Nível   |
| -- | ------------------------ | ----------------------------------------- | ------- |
| 1  | `text`                   | Texto exato e texto parcial               | Fácil   |
| 2  | `visibility`             | Visibilidade e existência                 | Médio   |
| 3  | `state`                  | Estado: habilitado, marcado e selecionado | Fácil   |
| 4  | `attributes-and-classes` | Atributos e classes CSS                   | Médio   |
| 5  | `url-and-title`          | URL e título após navegação               | Médio   |
| 6  | `list-count`             | Quantidade de itens após filtro           | Fácil   |
| 7  | `cart-totals`            | Valores calculados: carrinho de compras   | Difícil |
| 8  | `form-validation`        | Mensagens de validação de formulário      | Médio   |
| 9  | `sorting`                | Ordenação: alfabética e por data          | Difícil |
| 10 | `api-responses`          | Respostas de API                          | Difícil |

Valores fixos que os testes podem esperar:

- **Carrinho (7):** começa com 3 itens, subtotal R$ 379,70, frete R$ 20,00 e
  total R$ 399,70. Frete grátis a partir de R$ 500,00 em produtos. Cupons:
  `QA10` (10% sobre o subtotal) e `FRETEGRATIS`. Os valores são escritos como
  "R$ 1.234,56", com espaço comum, e também ficam em centavos em `data-cents`.
- **Atributos (4):** borda de erro `rgb(220, 38, 38)` e de sucesso
  `rgb(22, 163, 74)`, iguais nos temas claro e escuro e sem transição.
- **Contagem (6):** 12 produtos (5 periféricos, 3 de áudio, 2 monitores e
  2 acessórios), 9 em estoque.
- **Ordenação (9):** 8 clientes; a ordem alfabética começa em "Álvaro Dias" e
  termina em "Zélia Rocha". Cada data tem o valor ISO no atributo `datetime`.
- **URL e título (5):** o título da aba é "{seção} | Loja Demo · LocatorLab",
  com as seções `pedidos`, `perfil` e `login` no parâmetro `?section=`.
- **API (10):** o console só executa cenários que não alteram dados, usando o
  cookie da sessão. Os resultados que dependem dos dados (como o total de
  tarefas) supõem o banco restaurado pelo reset.

Nenhum desafio grava nada: recarregar ou reiniciar volta ao estado inicial.

## Painel do professor

Fica em `/admin` e só abre para usuários com papel admin. Tem três partes:

- **Usuários cadastrados:** nome, e-mail, papel, quantidade de tarefas e data de
  cadastro.
- **Restaurar banco de dados:** o mesmo efeito do endpoint de reset, com uma
  confirmação antes.
- **Modo Bug:** um interruptor e a lista dos defeitos que ele ativa, com link
  para a tela onde cada um aparece.

A permissão é conferida no servidor em três lugares: na página (quem não é
admin recebe "Acesso negado" e nenhum dado do painel é consultado), em cada
Server Action do painel e nas rotas `/api/v1/admin/*`.

| Método e rota                 | Corpo                   | Respostas          |
| ----------------------------- | ----------------------- | ------------------ |
| `GET /api/v1/admin/users`     | —                       | 200, 401, 403      |
| `GET /api/v1/admin/bug-mode`  | —                       | 200, 401, 403      |
| `PUT /api/v1/admin/bug-mode`  | `{ "enabled": true }`   | 200, 400, 401, 403 |

Sem login a resposta é 401; logado como aluno, 403.

## Modo Bug

Quando o admin liga o Modo Bug, a aplicação passa a ter seis defeitos
propositais, para **todos** os usuários. A configuração fica no banco (tabela
`Setting`, chave `bugMode`).

| Nº | Id                        | Onde                                  | O que acontece                                                        |
| -- | ------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| 1  | `task-save-not-persisted` | Tarefas › Editar                      | O aviso de sucesso aparece, mas a alteração não é gravada             |
| 2  | `cart-total`              | Assertions › Carrinho                 | O total não soma o frete (R$ 379,70 em vez de R$ 399,70)              |
| 3  | `success-typo`            | Tarefas › Nova tarefa                 | O aviso diz "Tarefa criada com suceso."                               |
| 4  | `deleted-item-stays`      | Tarefas › Excluir                     | A tarefa é apagada, mas a linha fica na lista até recarregar a página |
| 5  | `filter-extra-item`       | Assertions › Quantidade após filtro   | O filtro por categoria traz um item de outra ("Periféricos" mostra 6) |
| 6  | `button-always-enabled`   | Localizadores › Botão condicional     | "Criar conta" fica habilitado e cria a conta sem validar              |

O que vale saber:

- **O aluno não vê nenhum aviso.** Só o admin vê o selo "Modo Bug ativo" no topo
  e o estado no painel. Para o aluno, `GET /api/v1/admin/bug-mode` responde 403.
- **Vale a partir do próximo carregamento de página.** Quem já está com uma tela
  aberta só passa a ver (ou deixa de ver) os bugs dos desafios ao recarregar ou
  navegar.
- **O reset não desliga o Modo Bug.** Nem o botão do painel nem
  `POST /api/v1/reset` mexem nessa configuração, para que a suíte do aluno, que
  costuma chamar o reset no início, não desfaça o que o professor ligou.
- **A API REST de tarefas não tem bugs.** Os defeitos 1, 3 e 4 afetam só a
  interface; `/api/v1/tasks` continua correta e pode ser usada para preparar e
  conferir dados nos testes.

### Como os bugs estão organizados

Tudo parte de `src/lib/bugs/registry.ts`, que lista os bugs (id, título,
descrição, onde aparece e a chave `enabled`). O código de cada defeito consulta
essa lista pelo id:

- no servidor: `await isBugActive("id")`, de `src/lib/bugs/server.ts`;
- em componente cliente de um desafio: `useBug("id")`, de
  `src/components/bugs/bug-context.tsx`.

Para **adicionar** um bug, inclua uma entrada no registro e consulte o id no
ponto do código onde o defeito deve acontecer; ele aparece sozinho no painel.
Para **desligar** um bug sem apagar o código, troque `enabled` para `false` no
registro. Para **achar** onde um bug é aplicado, busque pelo id no projeto.

## Convenção de data-testid

Formato kebab-case `area-elemento[-id]`. Exemplos:

| Elemento                         | data-testid                                             |
| -------------------------------- | ------------------------------------------------------- |
| Campos de formulário             | `login-email-input`, `login-email-error`                |
| Botões                           | `login-submit-button`, `task-create-button`             |
| Erro geral do formulário         | `login-error-message`                                   |
| Linha e células da tabela        | `task-row-12`, `task-title-12`, `task-status-badge-12`  |
| Ações da linha                   | `task-edit-button-12`, `task-delete-button-12`          |
| Filtros                          | `tasks-search-input`, `tasks-status-filter`             |
| Contagem e paginação             | `tasks-count`, `pagination-next`, `pagination-page-2`   |
| Estados                          | `tasks-loading`, `tasks-empty-state`, `error-state`     |
| Contadores do dashboard          | `dashboard-stat-total`, `dashboard-stat-total-value`    |
| Navegação                        | `nav-link-tasks`, `user-menu-trigger`, `logout-button`  |
| Toasts                           | `toast-success`, `toast-error`                          |

Os mesmos elementos também têm `id`, `name`, `label` associado, `role` e
`aria-label`, para que possam ser localizados por várias estratégias. As linhas
da tabela expõem `data-status` e `data-priority` para assertions de atributo.

## Estrutura

```
prisma/               schema, migrations e seed
src/app/(auth)/       login e cadastro
src/app/(app)/        área logada: dashboard, tarefas, perfil, desafios e páginas "em breve"
src/app/embed/        páginas auxiliares dos desafios (iframe e nova aba)
src/app/api/v1/       API REST
src/actions/          Server Actions (auth, tarefas, perfil, admin)
src/components/       ui (shadcn), layout, auth, dashboard, tasks, profile, shared
src/components/challenges/   catálogo, página de desafio, dica e os componentes
                             dos desafios (locators/ e assertions/)
src/lib/              prisma, auth, validações Zod, regras de tarefas, respostas da API
src/lib/challenges/   textos dos desafios (títulos, níveis, objetivos e dicas)
src/lib/bugs/         registro central do Modo Bug e leitura da configuração
src/components/admin/ painel do professor
src/proxy.ts          protege as rotas da área logada
```

## Notas

- O `cacheComponents` do Next.js está desligado de propósito: ele mantém a
  página anterior escondida no DOM, o que duplicaria elementos e atrapalharia
  os localizadores.
- As animações duram 200 ms e respeitam a preferência "reduzir movimento" do
  sistema, para não deixar os testes instáveis.
- O avatar é guardado no próprio banco (até 1 MB), então o reset também o
  remove e não é preciso configurar um serviço de arquivos.
