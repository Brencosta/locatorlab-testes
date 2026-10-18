import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { fail, ok, unauthorized, withApi } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { adminPasswordProblem, resetDatabase } from "@/lib/seed-data";

// Comparação em tempo constante (não vaza o tamanho nem o conteúdo da chave).
function keysMatch(provided: string, expected: string) {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

// POST /api/v1/reset - restaura o banco para os dados do seed.
// Exige o header "x-reset-key" igual à variável de ambiente RESET_KEY.
export const POST = withApi(async (request) => {
  const expected = process.env.RESET_KEY;
  if (!expected) {
    return fail(
      500,
      "RESET_NOT_CONFIGURED",
      "A variável de ambiente RESET_KEY não está configurada no servidor.",
    );
  }

  const provided = request.headers.get("x-reset-key");
  if (!provided || !keysMatch(provided, expected)) {
    return unauthorized("Chave de reset inválida ou ausente (header x-reset-key).");
  }

  // Confere antes de apagar qualquer coisa: sem senha de admin válida, o banco
  // ficaria sem como entrar no painel.
  const passwordProblem = adminPasswordProblem();
  if (passwordProblem) {
    return fail(500, "ADMIN_PASSWORD_NOT_CONFIGURED", passwordProblem);
  }

  const counts = await resetDatabase(prisma);
  revalidatePath("/", "layout");

  return ok({
    message: "Banco restaurado para os dados do seed.",
    users: counts.users,
    tasks: counts.tasks,
  });
});
