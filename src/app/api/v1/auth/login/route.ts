import { API_TOKEN_TTL_SECONDS, signApiToken } from "@/lib/api-auth";
import {
  fail,
  ok,
  readJsonBody,
  validationError,
  withApi,
} from "@/lib/api-response";
import { verifyCredentials } from "@/lib/users";
import { loginSchema } from "@/lib/validations/auth";

// POST /api/v1/auth/login
export const POST = withApi(async (request) => {
  const json = await readJsonBody(request);
  if (!json.ok) return json.response;

  const parsed = loginSchema.safeParse(json.body);
  if (!parsed.success) return validationError(parsed.error);

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return fail(401, "INVALID_CREDENTIALS", "E-mail ou senha incorretos.");
  }

  return ok({
    token: await signApiToken(user),
    tokenType: "Bearer",
    expiresIn: API_TOKEN_TTL_SECONDS,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
