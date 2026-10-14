import { jwtVerify, SignJWT } from "jose";
import { forbidden, unauthorized } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/session";
import { getUserById, type AppUser } from "@/lib/users";

const ISSUER = "locatorlab";
const AUDIENCE = "locatorlab-api";
export const API_TOKEN_TTL_SECONDS = 60 * 60 * 24;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET não está configurado.");
  return new TextEncoder().encode(secret);
}

export function signApiToken(user: Pick<AppUser, "id" | "role">) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${API_TOKEN_TTL_SECONDS}s`)
    .sign(getSecret());
}

/**
 * Identifica quem está chamando a API.
 * - Com header Authorization: exige um Bearer token válido.
 * - Sem header: usa o cookie de sessão do navegador.
 */
export async function getApiUser(request: Request): Promise<AppUser | null> {
  const header = request.headers.get("authorization");

  if (header) {
    const match = /^Bearer\s+(.+)$/i.exec(header.trim());
    if (!match) return null;
    try {
      const { payload } = await jwtVerify(match[1], getSecret(), {
        issuer: ISSUER,
        audience: AUDIENCE,
      });
      return payload.sub ? getUserById(payload.sub) : null;
    } catch {
      return null;
    }
  }

  return getCurrentUser();
}

/**
 * Exige um admin autenticado nas rotas /api/v1/admin.
 * Sem credenciais: 401. Autenticado mas sem ser admin: 403.
 */
export async function requireApiAdmin(
  request: Request,
): Promise<{ ok: true; user: AppUser } | { ok: false; response: Response }> {
  const user = await getApiUser(request);
  if (!user) return { ok: false, response: unauthorized() };
  if (user.role !== "ADMIN") {
    return {
      ok: false,
      response: forbidden("Acesso restrito a administradores."),
    };
  }
  return { ok: true, user };
}
