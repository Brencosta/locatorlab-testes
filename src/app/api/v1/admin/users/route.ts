import { listUsers } from "@/lib/admin";
import { requireApiAdmin } from "@/lib/api-auth";
import { ok, withApi } from "@/lib/api-response";

// GET /api/v1/admin/users - lista os usuários cadastrados (somente admin).
export const GET = withApi(async (request) => {
  const admin = await requireApiAdmin(request);
  if (!admin.ok) return admin.response;

  return ok(await listUsers());
});
