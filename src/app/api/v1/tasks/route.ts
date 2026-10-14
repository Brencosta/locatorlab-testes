import { revalidatePath } from "next/cache";
import { getApiUser } from "@/lib/api-auth";
import {
  ok,
  readJsonBody,
  unauthorized,
  validationError,
  withApi,
} from "@/lib/api-response";
import { createTask, listTasks } from "@/lib/tasks";
import { parseTaskQuery, taskCreateSchema } from "@/lib/validations/task";

// GET /api/v1/tasks?page&pageSize&search&status&priority&sort
export const GET = withApi(async (request) => {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const query = parseTaskQuery(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success) return validationError(query.error);

  const { items, meta } = await listTasks(user, query.data);
  return ok(items, { meta });
});

// POST /api/v1/tasks
export const POST = withApi(async (request) => {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const json = await readJsonBody(request);
  if (!json.ok) return json.response;

  const parsed = taskCreateSchema.safeParse(json.body);
  if (!parsed.success) return validationError(parsed.error);

  const task = await createTask(user, parsed.data);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return ok(task, { status: 201 });
});
