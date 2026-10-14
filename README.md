# LocatorLab

Ambiente de prática para aulas de automação de testes. Os alunos treinam
**localizadores** (id, name, class, CSS, XPath, data-testid, texto, role/ARIA) e
**assertions** (texto, visibilidade, estado, atributos, URL, quantidade de itens,
respostas de API) usando Selenium, Cypress e Playwright.

Etapas concluídas (2 de 5):

1. Autenticação, dashboard, CRUD de tarefas, perfil, papéis, API REST, reset do
   banco e layout base.
2. Desafios de Localizadores: catálogo com filtro por nível e 19 desafios
   interativos.

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

`POST /api/v1/reset` apaga todos os dados (inclusive contas criadas pelos alunos
e avatares) e recria exatamente os registros do seed, com os IDs das tarefas
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

`meta` só aparece em listagens e `details` só em erros de validação.

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
`src/lib/challenges/locators.ts`, crie o componente em
`src/components/challenges/locators/` e registre-o no `index.ts` da mesma pasta.

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
src/actions/          Server Actions (auth, tarefas, perfil)
src/components/       ui (shadcn), layout, auth, dashboard, tasks, profile, shared
src/components/challenges/   área de prática, dica e os 19 desafios
src/lib/              prisma, auth, validações Zod, regras de tarefas, respostas da API
src/lib/challenges/   catálogo dos desafios (títulos, níveis, objetivos e dicas)
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
