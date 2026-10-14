"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { Panel, ui } from "@/components/challenges/ui";

type Scenario = {
  id: string;
  method: "GET" | "POST";
  path: string;
  body?: Record<string, unknown>;
  title: string;
  expectedStatus: string;
  /** O que validar na resposta. */
  checks: string[];
  note?: string;
};

// Só cenários que NÃO alteram dados: podem ser executados à vontade.
const SCENARIOS: Scenario[] = [
  {
    id: "health",
    method: "GET",
    path: "/api/v1/health",
    title: "Saúde da aplicação",
    expectedStatus: "200",
    checks: [
      "status code 200",
      "success é true",
      "data.status é \"ok\" e data.database é \"up\"",
      "header content-type contém application/json",
    ],
  },
  {
    id: "login-invalid",
    method: "POST",
    path: "/api/v1/auth/login",
    body: { email: "aluno@locatorlab.dev", password: "senha-errada" },
    title: "Login com senha errada",
    expectedStatus: "401",
    checks: [
      "status code 401",
      "success é false",
      "error.code é \"INVALID_CREDENTIALS\"",
      "error.message é \"E-mail ou senha incorretos.\"",
      "não existe data nem token na resposta",
    ],
  },
  {
    id: "login-validation",
    method: "POST",
    path: "/api/v1/auth/login",
    body: { email: "nao-e-um-email" },
    title: "Login com dados inválidos",
    expectedStatus: "400",
    checks: [
      "status code 400",
      "error.code é \"VALIDATION_ERROR\"",
      "error.details tem 2 itens: campos email e password",
      "cada item de details tem field e message",
    ],
  },
  {
    id: "tasks-list",
    method: "GET",
    path: "/api/v1/tasks?pageSize=3&sort=oldest",
    title: "Listagem paginada",
    expectedStatus: "200",
    checks: [
      "status code 200",
      "data é um array com 3 itens",
      "meta.page é 1, meta.pageSize é 3 e meta.totalPages é total ÷ 3 arredondado para cima",
      "cada tarefa tem id, title, status, priority, dueDate, createdAt e owner",
      "com sort=oldest e o banco restaurado, a primeira tarefa tem id 1",
    ],
  },
  {
    id: "tasks-filter",
    method: "GET",
    path: "/api/v1/tasks?status=DONE&pageSize=50",
    title: "Listagem com filtro",
    expectedStatus: "200",
    checks: [
      "status code 200",
      "todos os itens de data têm status \"DONE\"",
      "meta.total é igual à quantidade de itens (todos cabem em uma página)",
      "com o banco restaurado, o aluno tem 8 tarefas concluídas",
    ],
  },
  {
    id: "tasks-invalid-query",
    method: "GET",
    path: "/api/v1/tasks?page=0&status=FEITO",
    title: "Parâmetros de busca inválidos",
    expectedStatus: "400",
    checks: [
      "status code 400",
      "error.code é \"VALIDATION_ERROR\"",
      "error.details aponta os campos page e status",
    ],
  },
  {
    id: "task-by-id",
    method: "GET",
    path: "/api/v1/tasks/1",
    title: "Tarefa por id",
    expectedStatus: "200",
    checks: [
      "status code 200",
      "data.id é 1 (número, não texto)",
      "com o banco restaurado, data.title é \"Instalar o Node.js e o VS Code\" e data.status é \"DONE\"",
      "data.owner tem id e name",
      "não existe meta (só aparece em listagens)",
    ],
    note: "A tarefa 1 pertence ao aluno. Logado como admin, o resultado é o mesmo.",
  },
  {
    id: "task-not-found",
    method: "GET",
    path: "/api/v1/tasks/999999",
    title: "Tarefa inexistente",
    expectedStatus: "404",
    checks: [
      "status code 404",
      "success é false",
      "error.code é \"NOT_FOUND\"",
      "error.message é \"Tarefa não encontrada.\"",
    ],
  },
  {
    id: "task-forbidden",
    method: "GET",
    path: "/api/v1/tasks/25",
    title: "Tarefa de outro usuário",
    expectedStatus: "403 (aluno) ou 200 (admin)",
    checks: [
      "logado como aluno: status code 403 e error.code \"FORBIDDEN\"",
      "logado como admin: status code 200, porque o admin vê todas as tarefas",
      "403 é diferente de 404: o recurso existe, mas você não tem permissão",
    ],
    note: "A tarefa 25 pertence ao admin.",
  },
  {
    id: "task-create-invalid",
    method: "POST",
    path: "/api/v1/tasks",
    body: { title: "", status: "FEITO", dueDate: "2030-02-31" },
    title: "Criação com dados inválidos",
    expectedStatus: "400",
    checks: [
      "status code 400",
      "error.code é \"VALIDATION_ERROR\"",
      "error.details tem os campos title, status e dueDate",
      "nenhuma tarefa é criada: o total da listagem não muda",
    ],
  },
];

// Cenários que alteram dados: ficam para o aluno automatizar.
const MUTATING = [
  {
    request: "POST /api/v1/tasks",
    body: '{ "title": "Tarefa criada pelo teste" }',
    status: "201",
    checks: "data.id numérico; status \"PENDING\" e priority \"MEDIUM\" por padrão",
  },
  {
    request: "PATCH /api/v1/tasks/{id}",
    body: '{ "status": "DONE" }',
    status: "200",
    checks: "data.status \"DONE\" e data.completedAt preenchido",
  },
  {
    request: "PUT /api/v1/tasks/{id}",
    body: '{ "title": "Novo título" }',
    status: "200",
    checks: "campos não enviados voltam ao padrão (description e dueDate nulos)",
  },
  {
    request: "DELETE /api/v1/tasks/{id}",
    body: "—",
    status: "204",
    checks: "corpo vazio; um GET em seguida no mesmo id devolve 404",
  },
  {
    request: "GET /api/v1/tasks (sem cookie e sem token)",
    body: "—",
    status: "401",
    checks: "error.code \"UNAUTHORIZED\"",
  },
];

type ApiResult = {
  scenarioId: string;
  request: string;
  status: number;
  statusText: string;
  contentType: string | null;
  body: string;
};

const METHOD_STYLES = {
  GET: "bg-info/10 text-info",
  POST: "bg-success/10 text-success",
};

// Desafio 10 de assertions: guia dos cenários de API e um console que executa
// os que não alteram dados, usando o cookie da sessão atual.
export function ApiResponsesChallenge() {
  const [running, setRunning] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  async function run(scenario: Scenario) {
    setRunning(scenario.id);
    setFailure(null);

    try {
      const response = await fetch(scenario.path, {
        method: scenario.method,
        headers: scenario.body ? { "Content-Type": "application/json" } : undefined,
        body: scenario.body ? JSON.stringify(scenario.body) : undefined,
        cache: "no-store",
      });
      const text = await response.text();

      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // Resposta sem JSON (ex.: 204): mostra o texto como veio.
      }

      setResult({
        scenarioId: scenario.id,
        request: `${scenario.method} ${scenario.path}`,
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
        body: body || "(corpo vazio)",
      });
    } catch {
      setResult(null);
      setFailure("Não foi possível chamar a API. Verifique sua conexão.");
    } finally {
      setRunning(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_26rem]">
        <Panel
          title="Cenários"
          description="Nenhum destes altera dados: execute quantas vezes quiser."
        >
          <ul id="api-scenarios" className="grid gap-3">
            {SCENARIOS.map((scenario) => (
              <li
                key={scenario.id}
                id={`scenario-${scenario.id}`}
                data-scenario={scenario.id}
                data-active={result?.scenarioId === scenario.id}
                className="api-scenario min-w-0 rounded-lg border p-3 data-[active=true]:border-primary"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold">{scenario.title}</h4>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-xs">
                      <span
                        className={`scenario-method rounded px-1.5 py-0.5 font-semibold ${METHOD_STYLES[scenario.method]}`}
                      >
                        {scenario.method}
                      </span>
                      <span className="scenario-path break-all">{scenario.path}</span>
                    </p>
                  </div>
                  <button
                    id={`run-${scenario.id}`}
                    type="button"
                    className={`${ui.button} ${ui.outline} h-8`}
                    disabled={running !== null}
                    aria-busy={running === scenario.id}
                    onClick={() => run(scenario)}
                  >
                    {running === scenario.id ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Play className="size-4" aria-hidden="true" />
                    )}
                    Executar
                  </button>
                </div>

                {scenario.body ? (
                  <pre className="scenario-body mt-2 overflow-x-auto rounded bg-muted/60 px-2 py-1 font-mono text-xs">
                    {JSON.stringify(scenario.body)}
                  </pre>
                ) : null}

                <p className="mt-2 text-xs">
                  <span className="text-muted-foreground">Status esperado: </span>
                  <strong className="scenario-expected-status">
                    {scenario.expectedStatus}
                  </strong>
                </p>
                <ul className="scenario-checks mt-1 grid list-disc gap-0.5 pl-4 text-xs text-muted-foreground">
                  {scenario.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
                {scenario.note ? (
                  <p className="mt-1.5 text-xs text-muted-foreground italic">
                    {scenario.note}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Resposta"
          description="Resultado da última execução."
          className="xl:sticky xl:top-20 xl:self-start"
        >
          <div id="api-console" aria-live="polite" aria-busy={running !== null}>
            {failure ? (
              <p id="api-failure" role="alert" className="text-sm text-destructive">
                {failure}
              </p>
            ) : result ? (
              <div className="grid gap-3 text-sm">
                <p id="response-request" className="font-mono text-xs break-all">
                  {result.request}
                </p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <strong
                      id="response-status"
                      data-ok={result.status < 400}
                      className={
                        result.status < 400 ? "text-success" : "text-destructive"
                      }
                    >
                      {result.status}
                    </strong>{" "}
                    <span id="response-status-text" className="text-muted-foreground">
                      {result.statusText}
                    </span>
                  </dd>
                  <dt className="text-muted-foreground">content-type</dt>
                  <dd id="response-content-type" className="font-mono text-xs break-all">
                    {result.contentType ?? "(ausente)"}
                  </dd>
                </dl>
                <pre
                  id="response-body"
                  tabIndex={0}
                  className="max-h-96 overflow-auto rounded-lg bg-muted/60 p-3 font-mono text-xs leading-relaxed outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {result.body}
                </pre>
              </div>
            ) : (
              <p id="api-empty" className="text-sm text-muted-foreground">
                Clique em Executar em um cenário para ver o status, o
                content-type e o corpo da resposta.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <Panel
        title="Para automatizar no seu framework"
        description="Estes alteram dados (ou dependem de não ter sessão) e por isso não rodam no console acima."
      >
        <div className={ui.tableWrap}>
          <table id="mutating-scenarios" className={ui.table}>
            <thead>
              <tr>
                <th scope="col" className={ui.th}>Requisição</th>
                <th scope="col" className={ui.th}>Corpo</th>
                <th scope="col" className={ui.th}>Status</th>
                <th scope="col" className={ui.th}>O que validar</th>
              </tr>
            </thead>
            <tbody>
              {MUTATING.map((item) => (
                <tr key={item.request}>
                  <td className={`${ui.td} font-mono text-xs whitespace-nowrap`}>
                    {item.request}
                  </td>
                  <td className={`${ui.td} font-mono text-xs`}>{item.body}</td>
                  <td className={`${ui.td} font-semibold tabular-nums`}>
                    {item.status}
                  </td>
                  <td className={`${ui.td} min-w-56`}>{item.checks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`${ui.hint} mt-3`}>
          Para os resultados serem sempre os mesmos, restaure o banco antes da
          suíte com POST /api/v1/reset e o header x-reset-key.
        </p>
      </Panel>
    </div>
  );
}
