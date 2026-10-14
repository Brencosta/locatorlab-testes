import { CodeBlock } from "@/components/api-docs/code-block";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AUTH_LABELS,
  buildCurl,
  PARAM_LOCATIONS,
  type ApiEndpoint,
  type ApiMethod,
} from "@/lib/api-docs";
import { cn } from "@/lib/utils";

const METHOD_STYLES: Record<ApiMethod, string> = {
  GET: "bg-info/10 text-info",
  POST: "bg-success/10 text-success",
  PUT: "bg-warning/10 text-warning",
  PATCH: "bg-warning/10 text-warning",
  DELETE: "bg-destructive/10 text-destructive",
};

export function MethodBadge({ method }: { method: ApiMethod }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-14 shrink-0 items-center justify-center rounded px-1.5 font-mono text-xs font-semibold",
        METHOD_STYLES[method],
      )}
      data-method={method}
    >
      {method}
    </span>
  );
}

function statusTone(code: number) {
  if (code < 300) return "text-success";
  if (code < 500) return "text-warning";
  return "text-destructive";
}

function formatBody(body: unknown, note?: string) {
  return body === null ? (note ?? "Sem corpo.") : JSON.stringify(body, null, 2);
}

/** Documentação de um endpoint: parâmetros, exemplos e status codes. */
export function EndpointCard({
  endpoint,
  origin,
}: {
  endpoint: ApiEndpoint;
  /** Ex.: "https://locatorlab.vercel.app" */
  origin: string;
}) {
  const testId = `endpoint-${endpoint.id}`;

  return (
    <article
      id={testId}
      aria-labelledby={`${testId}-title`}
      className="scroll-mt-20 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
      data-testid={testId}
      data-method={endpoint.method}
      data-path={endpoint.path}
    >
      <header className="space-y-2">
        <h3 id={`${testId}-title`} className="font-semibold">
          {endpoint.summary}
        </h3>
        <p className="flex flex-wrap items-center gap-2">
          <MethodBadge method={endpoint.method} />
          <code className="font-mono text-sm break-all" data-testid={`${testId}-path`}>
            {endpoint.path}
          </code>
        </p>
        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
        <p className="text-sm">
          <span className="text-muted-foreground">Autenticação: </span>
          <Badge
            variant={endpoint.auth === "none" ? "outline" : "secondary"}
            data-testid={`${testId}-auth`}
            data-auth={endpoint.auth}
          >
            {AUTH_LABELS[endpoint.auth]}
          </Badge>
        </p>
      </header>

      <div className="mt-4 grid gap-4 *:min-w-0">
        <div>
          <h4 id={`${testId}-params`} className="mb-2 text-sm font-medium">
            Parâmetros
          </h4>
          {endpoint.params.length === 0 ? (
            <p className="text-sm text-muted-foreground" data-testid={`${testId}-no-params`}>
              Este endpoint não recebe parâmetros.
            </p>
          ) : (
            <div className="rounded-lg border">
              <Table data-testid={`${testId}-params-table`}>
                <caption className="sr-only">
                  Parâmetros de {endpoint.method} {endpoint.path}
                </caption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Nome</TableHead>
                    <TableHead scope="col">Onde</TableHead>
                    <TableHead scope="col">Tipo</TableHead>
                    <TableHead scope="col">Obrigatório</TableHead>
                    <TableHead scope="col">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endpoint.params.map((param) => (
                    <TableRow key={`${param.in}-${param.name}`} data-param={param.name}>
                      <TableCell className="font-mono text-xs">{param.name}</TableCell>
                      <TableCell>{PARAM_LOCATIONS[param.in]}</TableCell>
                      <TableCell className="font-mono text-xs">{param.type}</TableCell>
                      <TableCell>{param.required ? "Sim" : "Não"}</TableCell>
                      <TableCell className="min-w-56 whitespace-normal">
                        {param.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="grid gap-4 *:min-w-0 xl:grid-cols-2">
          <div className="min-w-0">
            <h4 id={`${testId}-request`} className="mb-2 text-sm font-medium">
              Exemplo de requisição
            </h4>
            <CodeBlock
              code={buildCurl(endpoint, origin)}
              label={`Exemplo de requisição: ${endpoint.summary}`}
              testId={`${testId}-request-example`}
            />
          </div>

          <div className="min-w-0">
            <h4 id={`${testId}-response`} className="mb-2 text-sm font-medium">
              Exemplo de resposta{" "}
              <span className={cn("font-mono", statusTone(endpoint.response.status))}>
                {endpoint.response.status}
              </span>
            </h4>
            <CodeBlock
              code={formatBody(endpoint.response.body, endpoint.response.note)}
              label={`Exemplo de resposta: ${endpoint.summary}`}
              testId={`${testId}-response-example`}
            />
            {endpoint.errorResponse ? (
              <>
                <h4 className="mt-3 mb-2 text-sm font-medium">
                  Exemplo de erro{" "}
                  <span
                    className={cn("font-mono", statusTone(endpoint.errorResponse.status))}
                  >
                    {endpoint.errorResponse.status}
                  </span>
                </h4>
                <CodeBlock
                  code={formatBody(endpoint.errorResponse.body)}
                  label={`Exemplo de erro: ${endpoint.summary}`}
                  testId={`${testId}-error-example`}
                />
              </>
            ) : null}
          </div>
        </div>

        <div>
          <h4 id={`${testId}-statuses`} className="mb-2 text-sm font-medium">
            Status codes
          </h4>
          <ul className="grid gap-1 text-sm" data-testid={`${testId}-statuses-list`}>
            {endpoint.statuses.map((status) => (
              <li key={status.code} className="flex gap-2" data-status={status.code}>
                <span
                  className={cn(
                    "w-9 shrink-0 font-mono font-semibold tabular-nums",
                    statusTone(status.code),
                  )}
                >
                  {status.code}
                </span>
                <span className="text-muted-foreground">{status.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
