import type { ZodError } from "zod";

/** Formato único de retorno de todas as Server Actions. */
export type ActionResult =
  | { success: true; message: string }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string>;
    };

/** Primeira mensagem de erro de cada campo. */
export function zodFieldErrors(error: ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".");
    if (field && !(field in fieldErrors)) fieldErrors[field] = issue.message;
  }
  return fieldErrors;
}

export function validationFailure(error: ZodError): ActionResult {
  return {
    success: false,
    message: "Corrija os campos destacados.",
    fieldErrors: zodFieldErrors(error),
  };
}

export const SESSION_EXPIRED: ActionResult = {
  success: false,
  message: "Sua sessão expirou. Faça login novamente.",
};

export const UNEXPECTED_ERROR: ActionResult = {
  success: false,
  message: "Algo deu errado. Tente novamente.",
};

export const ADMIN_ONLY: ActionResult = {
  success: false,
  message: "Acesso restrito a administradores.",
};
