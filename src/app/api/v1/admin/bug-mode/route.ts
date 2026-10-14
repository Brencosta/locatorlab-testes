import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireApiAdmin } from "@/lib/api-auth";
import { ok, readJsonBody, validationError, withApi } from "@/lib/api-response";
import { BUGS, resolveActiveBugs } from "@/lib/bugs/registry";
import { getBugMode, setBugMode } from "@/lib/bugs/server";

const bugModeSchema = z.object({
  enabled: z.boolean({ error: "enabled deve ser true ou false." }),
});

function describe(enabled: boolean) {
  const active = resolveActiveBugs(enabled);
  return {
    enabled,
    bugs: BUGS.map((bug) => ({
      id: bug.id,
      title: bug.title,
      active: active.includes(bug.id),
    })),
  };
}

// GET /api/v1/admin/bug-mode - estado do Modo Bug (somente admin).
// Para o aluno a resposta é 403: ele não tem como saber se o modo está ligado.
export const GET = withApi(async (request) => {
  const admin = await requireApiAdmin(request);
  if (!admin.ok) return admin.response;

  return ok(describe(await getBugMode()));
});

// PUT /api/v1/admin/bug-mode - liga ou desliga o Modo Bug (somente admin).
export const PUT = withApi(async (request) => {
  const admin = await requireApiAdmin(request);
  if (!admin.ok) return admin.response;

  const json = await readJsonBody(request);
  if (!json.ok) return json.response;

  const parsed = bugModeSchema.safeParse(json.body);
  if (!parsed.success) return validationError(parsed.error);

  await setBugMode(parsed.data.enabled);
  revalidatePath("/", "layout");
  return ok(describe(parsed.data.enabled));
});
