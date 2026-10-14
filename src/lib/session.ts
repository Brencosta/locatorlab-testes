import { cache } from "react";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/users";

/**
 * Usuário logado, sempre conferido no banco.
 * Retorna null se não houver sessão ou se o usuário não existir mais
 * (por exemplo, depois de um reset do banco).
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return getUserById(session.user.id);
});

/**
 * Usuário logado, somente se for admin; senão, null.
 * O papel vem do banco, não do cookie: é a checagem de permissão usada pelas
 * páginas e Server Actions do painel do professor.
 */
export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN" ? user : null;
}
