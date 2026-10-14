import { NextResponse, type NextRequest } from "next/server";
import type { ZodError } from "zod";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_JSON"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RESET_NOT_CONFIGURED"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export type ApiErrorDetail = { field: string; message: string };

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/** Resposta de sucesso: { success: true, data, meta? } */
export function ok<T>(
  data: T,
  options: { status?: number; meta?: PaginationMeta } = {},
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(options.meta ? { meta: options.meta } : {}),
    },
    { status: options.status ?? 200 },
  );
}

/** Resposta de erro: { success: false, error: { code, message, details? } } */
export function fail(
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: ApiErrorDetail[],
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status },
  );
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function validationError(error: ZodError) {
  const details = error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
  return fail(400, "VALIDATION_ERROR", "Dados inválidos.", details);
}

export function unauthorized(
  message = "Autenticação necessária. Envie o header Authorization: Bearer <token>.",
) {
  return fail(401, "UNAUTHORIZED", message);
}

export function forbidden(
  message = "Você não tem permissão para acessar este recurso.",
) {
  return fail(403, "FORBIDDEN", message);
}

export function notFound(message = "Recurso não encontrado.") {
  return fail(404, "NOT_FOUND", message);
}

/** Lê o corpo JSON; devolve uma resposta 400 pronta se for inválido. */
export async function readJsonBody(
  request: Request,
): Promise<
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; response: NextResponse }
> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: fail(
        400,
        "INVALID_JSON",
        "O corpo da requisição não é um JSON válido.",
      ),
    };
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      ok: false,
      response: fail(
        400,
        "INVALID_JSON",
        "O corpo da requisição deve ser um objeto JSON.",
      ),
    };
  }

  return { ok: true, body: body as Record<string, unknown> };
}

/** Garante que erros inesperados também saiam no formato padrão (500). */
export function withApi<Context>(
  handler: (request: NextRequest, context: Context) => Promise<Response>,
) {
  return async (request: NextRequest, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error(`[api] ${request.method} ${request.nextUrl.pathname}`, error);
      return fail(
        500,
        "INTERNAL_ERROR",
        "Erro interno. Tente novamente em instantes.",
      );
    }
  };
}
