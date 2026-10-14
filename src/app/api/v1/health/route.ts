import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

// GET /api/v1/health - verifica se a aplicação e o banco estão no ar.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ok({ status: "ok", database: "up" });
  } catch (error) {
    console.error("[api] GET /api/v1/health", error);
    return fail(
      503,
      "SERVICE_UNAVAILABLE",
      "Não foi possível conectar ao banco de dados.",
    );
  }
}
