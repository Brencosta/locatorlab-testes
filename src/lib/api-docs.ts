// Conteúdo da página "Documentação da API".
// Cada endpoint é descrito aqui e a página só renderiza esta lista.
// Os exemplos de resposta usam os dados do seed (banco recém-restaurado).
import { BUGS } from "@/lib/bugs/registry";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Quem pode chamar o endpoint. */
export type ApiAuth = "none" | "user" | "admin" | "reset-key";

export const AUTH_LABELS: Record<ApiAuth, string> = {
  none: "Sem autenticação",
  user: "Bearer token ou cookie de sessão",
  admin: "Somente admin",
  "reset-key": "Header x-reset-key",
};

export type ApiParam = {
  name: string;
  in: "path" | "query" | "body" | "header";
  type: string;
  required: boolean;
  description: string;
};

export const PARAM_LOCATIONS: Record<ApiParam["in"], string> = {
  path: "URL",
  query: "Query string",
  body: "Corpo (JSON)",
  header: "Header",
};

export type ApiEndpoint = {
  id: string;
  method: ApiMethod;
  /** Caminho com os parâmetros entre chaves: /api/v1/tasks/{id} */
  path: string;
  summary: string;
  description: string;
  auth: ApiAuth;
  params: ApiParam[];
  /** Exemplo de requisição. */
  request: {
    /** Caminho já preenchido, com query string se houver. */
    path: string;
    body?: unknown;
  };
  /** Exemplo de resposta de sucesso. body null = sem corpo. */
  response: { status: number; body: unknown; note?: string };
  /** Exemplo de resposta de erro (opcional). */
  errorResponse?: { status: number; body: unknown };
  statuses: Array<{ code: number; description: string }>;
};

export type ApiGroup = {
  id: string;
  title: string;
  description: string;
  adminOnly?: boolean;
  endpoints: ApiEndpoint[];
};

export const API_ERROR_CODES: Array<{
  code: string;
  status: number;
  description: string;
}> = [
  { code: "VALIDATION_ERROR", status: 400, description: "Dados inválidos; error.details lista um erro por campo." },
  { code: "INVALID_JSON", status: 400, description: "O corpo não é um JSON válido ou não é um objeto." },
  { code: "INVALID_CREDENTIALS", status: 401, description: "E-mail ou senha incorretos no login." },
  { code: "UNAUTHORIZED", status: 401, description: "Sem token ou sessão válidos, ou chave de reset incorreta." },
  { code: "FORBIDDEN", status: 403, description: "Autenticado, mas sem permissão para o recurso." },
  { code: "NOT_FOUND", status: 404, description: "O recurso não existe." },
  { code: "RESET_NOT_CONFIGURED", status: 500, description: "A variável RESET_KEY não foi definida no servidor." },
  { code: "INTERNAL_ERROR", status: 500, description: "Erro inesperado no servidor." },
  { code: "SERVICE_UNAVAILABLE", status: 503, description: "A aplicação não conseguiu acessar o banco de dados." },
];

// ---------------------------------------------------------------------------
// Dados de exemplo (iguais aos do seed)

const OWNER = { id: "seed_user_aluno", name: "Aluno Teste" };

const TASK_1 = {
  id: 1,
  title: "Instalar o Node.js e o VS Code",
  description: "Preparar o ambiente local para as aulas.",
  status: "DONE",
  priority: "LOW",
  dueDate: "2025-01-10",
  completedAt: "2025-01-08T12:00:00.000Z",
  createdAt: "2025-01-06T12:00:00.000Z",
  updatedAt: "2025-01-08T12:00:00.000Z",
  owner: OWNER,
};

const TASK_2 = {
  id: 2,
  title: "Configurar o projeto Cypress",
  description: "Criar o repositório e rodar o teste de exemplo.",
  status: "DONE",
  priority: "HIGH",
  dueDate: "2025-01-12",
  completedAt: "2025-01-09T12:00:00.000Z",
  createdAt: "2025-01-07T12:00:00.000Z",
  updatedAt: "2025-01-09T12:00:00.000Z",
  owner: OWNER,
};

const TASK_5 = {
  id: 5,
  title: "Praticar XPath com eixos",
  description: "following-sibling, ancestor e contains().",
  status: "IN_PROGRESS",
  priority: "HIGH",
  dueDate: "2030-03-01",
  completedAt: null,
  createdAt: "2025-01-10T12:00:00.000Z",
  updatedAt: "2025-01-10T12:00:00.000Z",
  owner: OWNER,
};

const NOW = "2026-01-15T14:30:00.000Z";

const TASK_PARAMS_BODY: ApiParam[] = [
  { name: "title", in: "body", type: "string", required: true, description: "De 3 a 100 caracteres." },
  { name: "description", in: "body", type: "string | null", required: false, description: "Até 500 caracteres." },
  { name: "status", in: "body", type: "string", required: false, description: "PENDING, IN_PROGRESS ou DONE. Padrão: PENDING." },
  { name: "priority", in: "body", type: "string", required: false, description: "LOW, MEDIUM ou HIGH. Padrão: MEDIUM." },
  { name: "dueDate", in: "body", type: "string | null", required: false, description: "Data no formato AAAA-MM-DD." },
];

const TASK_ID_PARAM: ApiParam = {
  name: "id",
  in: "path",
  type: "integer",
  required: true,
  description: "Id numérico da tarefa.",
};

const ERROR_401 = {
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Autenticação necessária. Envie o header Authorization: Bearer <token>.",
  },
};

const ERROR_404 = {
  success: false,
  error: { code: "NOT_FOUND", message: "Tarefa não encontrada." },
};

const ERROR_403_TASK = {
  success: false,
  error: { code: "FORBIDDEN", message: "Esta tarefa pertence a outro usuário." },
};

const ERROR_403_ADMIN = {
  success: false,
  error: { code: "FORBIDDEN", message: "Acesso restrito a administradores." },
};

const TASK_ACCESS_STATUSES = [
  { code: 401, description: "Sem token ou sessão válidos." },
  { code: 403, description: "A tarefa pertence a outro usuário (admin acessa todas)." },
  { code: 404, description: "Não existe tarefa com esse id." },
];

function bugModeExample(enabled: boolean) {
  return {
    success: true,
    data: {
      enabled,
      bugs: BUGS.map((bug) => ({
        id: bug.id,
        title: bug.title,
        active: enabled && bug.enabled,
      })),
    },
  };
}

// ---------------------------------------------------------------------------

export const API_GROUPS: ApiGroup[] = [
  {
    id: "auth",
    title: "Autenticação",
    description: "Troque e-mail e senha por um token para usar nas outras chamadas.",
    endpoints: [
      {
        id: "login",
        method: "POST",
        path: "/api/v1/auth/login",
        summary: "Fazer login",
        description:
          "Devolve um token JWT válido por 24 horas. Envie-o nas demais chamadas no header Authorization: Bearer <token>.",
        auth: "none",
        params: [
          { name: "email", in: "body", type: "string", required: true, description: "E-mail do usuário." },
          { name: "password", in: "body", type: "string", required: true, description: "Senha do usuário." },
        ],
        request: {
          path: "/api/v1/auth/login",
          body: { email: "aluno@locatorlab.dev", password: "Aluno@123" },
        },
        response: {
          status: 200,
          body: {
            success: true,
            data: {
              token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCJ9.exemplo",
              tokenType: "Bearer",
              expiresIn: 86400,
              user: {
                id: "seed_user_aluno",
                name: "Aluno Teste",
                email: "aluno@locatorlab.dev",
                role: "STUDENT",
              },
            },
          },
        },
        errorResponse: {
          status: 401,
          body: {
            success: false,
            error: {
              code: "INVALID_CREDENTIALS",
              message: "E-mail ou senha incorretos.",
            },
          },
        },
        statuses: [
          { code: 200, description: "Login realizado." },
          { code: 400, description: "E-mail ou senha ausentes, e-mail em formato inválido ou JSON malformado." },
          { code: 401, description: "E-mail ou senha incorretos." },
        ],
      },
    ],
  },
  {
    id: "tasks",
    title: "Tarefas",
    description:
      "CRUD de tarefas. O aluno enxerga só as próprias; o admin enxerga e altera as de todos.",
    endpoints: [
      {
        id: "tasks-list",
        method: "GET",
        path: "/api/v1/tasks",
        summary: "Listar tarefas",
        description:
          "Lista paginada, com busca, filtros e ordenação. A resposta traz meta com os dados da paginação.",
        auth: "user",
        params: [
          { name: "page", in: "query", type: "integer", required: false, description: "Página, a partir de 1. Padrão: 1." },
          { name: "pageSize", in: "query", type: "integer", required: false, description: "Itens por página, de 1 a 50. Padrão: 10." },
          { name: "search", in: "query", type: "string", required: false, description: "Texto buscado no título e na descrição (sem diferenciar maiúsculas)." },
          { name: "status", in: "query", type: "string", required: false, description: "PENDING, IN_PROGRESS ou DONE." },
          { name: "priority", in: "query", type: "string", required: false, description: "LOW, MEDIUM ou HIGH." },
          { name: "sort", in: "query", type: "string", required: false, description: "newest (padrão), oldest, dueDate, title ou priority." },
        ],
        request: { path: "/api/v1/tasks?pageSize=2&sort=oldest" },
        response: {
          status: 200,
          body: {
            success: true,
            data: [TASK_1, TASK_2],
            meta: { page: 1, pageSize: 2, total: 24, totalPages: 12 },
          },
        },
        errorResponse: {
          status: 400,
          body: {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Dados inválidos.",
              details: [
                { field: "page", message: "page deve ser maior ou igual a 1." },
              ],
            },
          },
        },
        statuses: [
          { code: 200, description: "Lista devolvida (data pode ser um array vazio)." },
          { code: 400, description: "Algum parâmetro de busca é inválido." },
          { code: 401, description: "Sem token ou sessão válidos." },
        ],
      },
      {
        id: "tasks-create",
        method: "POST",
        path: "/api/v1/tasks",
        summary: "Criar tarefa",
        description: "Cria uma tarefa para o usuário autenticado. Só o título é obrigatório.",
        auth: "user",
        params: TASK_PARAMS_BODY,
        request: {
          path: "/api/v1/tasks",
          body: {
            title: "Estudar seletores CSS",
            description: "Combinadores e pseudo-classes",
            priority: "HIGH",
            dueDate: "2030-03-01",
          },
        },
        response: {
          status: 201,
          body: {
            success: true,
            data: {
              id: 31,
              title: "Estudar seletores CSS",
              description: "Combinadores e pseudo-classes",
              status: "PENDING",
              priority: "HIGH",
              dueDate: "2030-03-01",
              completedAt: null,
              createdAt: NOW,
              updatedAt: NOW,
              owner: OWNER,
            },
          },
        },
        errorResponse: {
          status: 400,
          body: {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Dados inválidos.",
              details: [{ field: "title", message: "Informe o título." }],
            },
          },
        },
        statuses: [
          { code: 201, description: "Tarefa criada." },
          { code: 400, description: "Dados inválidos ou JSON malformado." },
          { code: 401, description: "Sem token ou sessão válidos." },
        ],
      },
      {
        id: "tasks-get",
        method: "GET",
        path: "/api/v1/tasks/{id}",
        summary: "Buscar tarefa por id",
        description: "Devolve uma tarefa. A resposta não tem meta.",
        auth: "user",
        params: [TASK_ID_PARAM],
        request: { path: "/api/v1/tasks/5" },
        response: { status: 200, body: { success: true, data: TASK_5 } },
        errorResponse: { status: 404, body: ERROR_404 },
        statuses: [
          { code: 200, description: "Tarefa encontrada." },
          ...TASK_ACCESS_STATUSES,
        ],
      },
      {
        id: "tasks-replace",
        method: "PUT",
        path: "/api/v1/tasks/{id}",
        summary: "Substituir tarefa",
        description:
          "Substitui a tarefa inteira. Os campos opcionais não enviados voltam ao padrão: descrição e prazo nulos, status PENDING e prioridade MEDIUM.",
        auth: "user",
        params: [TASK_ID_PARAM, ...TASK_PARAMS_BODY],
        request: {
          path: "/api/v1/tasks/5",
          body: { title: "Praticar XPath", status: "DONE" },
        },
        response: {
          status: 200,
          body: {
            success: true,
            data: {
              ...TASK_5,
              title: "Praticar XPath",
              description: null,
              status: "DONE",
              priority: "MEDIUM",
              dueDate: null,
              completedAt: NOW,
              updatedAt: NOW,
            },
          },
        },
        errorResponse: { status: 403, body: ERROR_403_TASK },
        statuses: [
          { code: 200, description: "Tarefa substituída." },
          { code: 400, description: "Dados inválidos ou JSON malformado." },
          ...TASK_ACCESS_STATUSES,
        ],
      },
      {
        id: "tasks-update",
        method: "PATCH",
        path: "/api/v1/tasks/{id}",
        summary: "Alterar parte da tarefa",
        description:
          "Altera só os campos enviados (pelo menos um). Mudar o status para DONE preenche completedAt; tirar de DONE limpa.",
        auth: "user",
        params: [
          TASK_ID_PARAM,
          ...TASK_PARAMS_BODY.map((param) => ({ ...param, required: false })),
        ],
        request: { path: "/api/v1/tasks/5", body: { status: "DONE" } },
        response: {
          status: 200,
          body: {
            success: true,
            data: { ...TASK_5, status: "DONE", completedAt: NOW, updatedAt: NOW },
          },
        },
        errorResponse: {
          status: 400,
          body: {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Dados inválidos.",
              details: [
                { field: "body", message: "Envie pelo menos um campo para atualizar." },
              ],
            },
          },
        },
        statuses: [
          { code: 200, description: "Tarefa alterada." },
          { code: 400, description: "Nenhum campo enviado, dados inválidos ou JSON malformado." },
          ...TASK_ACCESS_STATUSES,
        ],
      },
      {
        id: "tasks-delete",
        method: "DELETE",
        path: "/api/v1/tasks/{id}",
        summary: "Excluir tarefa",
        description: "Exclui a tarefa. A resposta de sucesso não tem corpo.",
        auth: "user",
        params: [TASK_ID_PARAM],
        request: { path: "/api/v1/tasks/5" },
        response: { status: 204, body: null, note: "Sem corpo." },
        errorResponse: { status: 404, body: ERROR_404 },
        statuses: [
          { code: 204, description: "Tarefa excluída (sem corpo)." },
          ...TASK_ACCESS_STATUSES,
        ],
      },
    ],
  },
  {
    id: "utilities",
    title: "Utilitários",
    description: "Restauração do banco, verificação de saúde e avatares.",
    endpoints: [
      {
        id: "reset",
        method: "POST",
        path: "/api/v1/reset",
        summary: "Restaurar o banco",
        description:
          "Apaga usuários e tarefas e recria os dados do seed (2 usuários e 30 tarefas, com ids a partir de 1). Não altera o Modo Bug. A chave é definida pelo professor na variável de ambiente RESET_KEY.",
        auth: "reset-key",
        params: [
          { name: "x-reset-key", in: "header", type: "string", required: true, description: "Chave de reset do ambiente." },
        ],
        request: { path: "/api/v1/reset" },
        response: {
          status: 200,
          body: {
            success: true,
            data: {
              message: "Banco restaurado para os dados do seed.",
              users: 2,
              tasks: 30,
            },
          },
        },
        errorResponse: {
          status: 401,
          body: {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Chave de reset inválida ou ausente (header x-reset-key).",
            },
          },
        },
        statuses: [
          { code: 200, description: "Banco restaurado." },
          { code: 401, description: "Chave ausente ou incorreta." },
          { code: 500, description: "RESET_KEY não configurada no servidor." },
        ],
      },
      {
        id: "health",
        method: "GET",
        path: "/api/v1/health",
        summary: "Verificar a saúde",
        description: "Confirma que a aplicação está no ar e consegue acessar o banco.",
        auth: "none",
        params: [],
        request: { path: "/api/v1/health" },
        response: {
          status: 200,
          body: { success: true, data: { status: "ok", database: "up" } },
        },
        statuses: [
          { code: 200, description: "Aplicação e banco funcionando." },
          { code: 503, description: "Banco de dados inacessível." },
        ],
      },
      {
        id: "avatar",
        method: "GET",
        path: "/api/v1/avatars/{userId}",
        summary: "Baixar avatar",
        description:
          "Devolve a imagem de avatar de um usuário. É o único endpoint cuja resposta de sucesso não é JSON.",
        auth: "none",
        params: [
          { name: "userId", in: "path", type: "string", required: true, description: "Id do usuário." },
        ],
        request: { path: "/api/v1/avatars/seed_user_aluno" },
        response: {
          status: 200,
          body: null,
          note: "Corpo binário (image/png, image/jpeg ou image/webp), com o tipo no header Content-Type.",
        },
        errorResponse: {
          status: 404,
          body: {
            success: false,
            error: { code: "NOT_FOUND", message: "Avatar não encontrado." },
          },
        },
        statuses: [
          { code: 200, description: "Imagem devolvida." },
          { code: 404, description: "O usuário não existe ou não tem avatar." },
        ],
      },
    ],
  },
  {
    id: "admin",
    title: "Painel do professor",
    description: "Endpoints exclusivos para administradores.",
    adminOnly: true,
    endpoints: [
      {
        id: "admin-users",
        method: "GET",
        path: "/api/v1/admin/users",
        summary: "Listar usuários",
        description: "Todos os usuários cadastrados, com a quantidade de tarefas de cada um.",
        auth: "admin",
        params: [],
        request: { path: "/api/v1/admin/users" },
        response: {
          status: 200,
          body: {
            success: true,
            data: [
              {
                id: "seed_user_admin",
                name: "Admin LocatorLab",
                email: "admin@locatorlab.dev",
                role: "ADMIN",
                hasAvatar: false,
                taskCount: 6,
                createdAt: "2025-01-05T12:00:00.000Z",
              },
              {
                id: "seed_user_aluno",
                name: "Aluno Teste",
                email: "aluno@locatorlab.dev",
                role: "STUDENT",
                hasAvatar: false,
                taskCount: 24,
                createdAt: "2025-01-05T12:00:00.000Z",
              },
            ],
          },
        },
        errorResponse: { status: 403, body: ERROR_403_ADMIN },
        statuses: [
          { code: 200, description: "Lista devolvida." },
          { code: 401, description: "Sem token ou sessão válidos." },
          { code: 403, description: "O usuário autenticado não é admin." },
        ],
      },
      {
        id: "admin-bug-mode-get",
        method: "GET",
        path: "/api/v1/admin/bug-mode",
        summary: "Consultar o Modo Bug",
        description: "Estado do Modo Bug e a lista dos defeitos que ele ativa.",
        auth: "admin",
        params: [],
        request: { path: "/api/v1/admin/bug-mode" },
        response: { status: 200, body: bugModeExample(false) },
        errorResponse: { status: 403, body: ERROR_403_ADMIN },
        statuses: [
          { code: 200, description: "Estado devolvido." },
          { code: 401, description: "Sem token ou sessão válidos." },
          { code: 403, description: "O usuário autenticado não é admin." },
        ],
      },
      {
        id: "admin-bug-mode-set",
        method: "PUT",
        path: "/api/v1/admin/bug-mode",
        summary: "Ligar ou desligar o Modo Bug",
        description: "Vale para todos os usuários, a partir do próximo carregamento de página.",
        auth: "admin",
        params: [
          { name: "enabled", in: "body", type: "boolean", required: true, description: "true liga, false desliga." },
        ],
        request: { path: "/api/v1/admin/bug-mode", body: { enabled: true } },
        response: { status: 200, body: bugModeExample(true) },
        errorResponse: { status: 401, body: ERROR_401 },
        statuses: [
          { code: 200, description: "Modo Bug alterado." },
          { code: 400, description: "enabled ausente ou não booleano, ou JSON malformado." },
          { code: 401, description: "Sem token ou sessão válidos." },
          { code: 403, description: "O usuário autenticado não é admin." },
        ],
      },
    ],
  },
];

/** Comando curl do exemplo de requisição, pronto para copiar. */
export function buildCurl(endpoint: ApiEndpoint, origin: string) {
  const lines = [
    endpoint.method === "GET"
      ? `curl "${origin}${endpoint.request.path}"`
      : `curl -X ${endpoint.method} "${origin}${endpoint.request.path}"`,
  ];

  if (endpoint.auth === "user" || endpoint.auth === "admin") {
    lines.push('-H "Authorization: Bearer $TOKEN"');
  }
  if (endpoint.auth === "reset-key") {
    lines.push('-H "x-reset-key: $RESET_KEY"');
  }
  if (endpoint.request.body !== undefined) {
    lines.push('-H "Content-Type: application/json"');
    lines.push(`-d '${JSON.stringify(endpoint.request.body)}'`);
  }

  return lines.join(" \\\n  ");
}
