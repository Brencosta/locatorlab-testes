import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CodeBlock } from "@/components/api-docs/code-block";
import { EndpointCard, MethodBadge } from "@/components/api-docs/endpoint-card";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_ERROR_CODES, API_GROUPS } from "@/lib/api-docs";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Documentação da API" };

const SUCCESS_ENVELOPE = JSON.stringify(
  {
    success: true,
    data: { id: 1, title: "..." },
    meta: { page: 1, pageSize: 10, total: 24, totalPages: 3 },
  },
  null,
  2,
);

const ERROR_ENVELOPE = JSON.stringify(
  {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Dados inválidos.",
      details: [{ field: "title", message: "Informe o título." }],
    },
  },
  null,
  2,
);

/** Endereço pelo qual o usuário está acessando o site (para os exemplos). */
async function getOrigin() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${protocol}://${host}`;
}

export default async function ApiDocsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const origin = await getOrigin();
  // Os endpoints do painel só são documentados para quem pode usá-los.
  const groups = API_GROUPS.filter(
    (group) => !group.adminOnly || user.role === "ADMIN",
  );
  const endpointCount = groups.reduce(
    (sum, group) => sum + group.endpoints.length,
    0,
  );

  const loginCurl = [
    `curl -X POST "${origin}/api/v1/auth/login"`,
    '-H "Content-Type: application/json"',
    `-d '{"email":"aluno@locatorlab.dev","password":"Aluno@123"}'`,
  ].join(" \\\n  ");

  return (
    <>
      <PageHeader
        title="Documentação da API"
        description="Referência dos endpoints REST do LocatorLab, com exemplos prontos para copiar."
      />

      <FadeIn className="grid gap-6 *:min-w-0">
        <section
          aria-labelledby="overview-title"
          className="grid gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 *:min-w-0"
          data-testid="api-overview"
        >
          <h2 id="overview-title" className="font-semibold">
            Visão geral
          </h2>

          <dl className="grid gap-3 text-sm *:min-w-0 sm:grid-cols-[auto_1fr] sm:gap-x-6">
            <dt className="text-muted-foreground">URL base</dt>
            <dd>
              <code className="font-mono text-xs break-all" data-testid="api-base-url">
                {origin}/api/v1
              </code>
            </dd>
            <dt className="text-muted-foreground">Formato</dt>
            <dd>
              JSON nas requisições e nas respostas (
              <code className="font-mono text-xs">Content-Type: application/json</code>
              ).
            </dd>
            <dt className="text-muted-foreground">Autenticação</dt>
            <dd>
              Faça login, guarde <code className="font-mono text-xs">data.token</code> e
              envie-o no header{" "}
              <code className="font-mono text-xs">Authorization: Bearer &lt;token&gt;</code>.
              O token vale 24 horas. No navegador, o cookie da sessão também é aceito.
            </dd>
            <dt className="text-muted-foreground">Dados</dt>
            <dd>
              Os exemplos usam os dados iniciais do ambiente. Se alguém já alterou ou
              excluiu tarefas, os valores podem ser diferentes até o banco ser restaurado.
            </dd>
          </dl>

          <div className="grid gap-4 *:min-w-0 lg:grid-cols-2">
            <div className="min-w-0">
              <h3 className="mb-2 text-sm font-medium">Resposta de sucesso</h3>
              <CodeBlock
                code={SUCCESS_ENVELOPE}
                label="Formato da resposta de sucesso"
                testId="api-success-envelope"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                <code className="font-mono">meta</code> só aparece nas listagens.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="mb-2 text-sm font-medium">Resposta de erro</h3>
              <CodeBlock
                code={ERROR_ENVELOPE}
                label="Formato da resposta de erro"
                testId="api-error-envelope"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                <code className="font-mono">details</code> só aparece em erros de
                validação, com um item por campo.
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="mb-2 text-sm font-medium">Obtendo um token</h3>
            <CodeBlock
              code={loginCurl}
              label="Exemplo de login para obter o token"
              testId="api-login-example"
            />
          </div>
        </section>

        <nav
          aria-labelledby="toc-title"
          className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          data-testid="api-toc"
        >
          <h2 id="toc-title" className="mb-3 font-semibold">
            Endpoints{" "}
            <span
              className="font-normal text-muted-foreground"
              data-testid="api-endpoint-count"
              data-total={endpointCount}
            >
              ({endpointCount})
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {groups.map((group) => (
              <div key={group.id}>
                <h3 className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {group.title}
                </h3>
                <ul className="grid gap-1">
                  {group.endpoints.map((endpoint) => (
                    <li key={endpoint.id}>
                      <a
                        href={`#endpoint-${endpoint.id}`}
                        className="flex items-center gap-2 rounded-md py-0.5 text-sm outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                        data-testid={`api-toc-link-${endpoint.id}`}
                      >
                        <MethodBadge method={endpoint.method} />
                        <span className="min-w-0 truncate">{endpoint.summary}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {groups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`group-${group.id}-title`}
            className="grid gap-4 *:min-w-0"
            data-testid={`api-group-${group.id}`}
          >
            <div>
              <h2 id={`group-${group.id}-title`} className="text-lg font-semibold">
                {group.title}
              </h2>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            {group.endpoints.map((endpoint) => (
              <EndpointCard key={endpoint.id} endpoint={endpoint} origin={origin} />
            ))}
          </section>
        ))}

        <section
          aria-labelledby="error-codes-title"
          className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          data-testid="api-error-codes"
        >
          <h2 id="error-codes-title" className="mb-1 font-semibold">
            Códigos de erro
          </h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Valores possíveis de <code className="font-mono text-xs">error.code</code>.
          </p>
          <div className="rounded-lg border">
            <Table data-testid="api-error-codes-table">
              <caption className="sr-only">Códigos de erro da API</caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Código</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Quando acontece</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {API_ERROR_CODES.map((item) => (
                  <TableRow key={item.code} data-code={item.code}>
                    <TableCell className="font-mono text-xs">{item.code}</TableCell>
                    <TableCell className="font-mono tabular-nums">{item.status}</TableCell>
                    <TableCell className="min-w-64 whitespace-normal">
                      {item.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
