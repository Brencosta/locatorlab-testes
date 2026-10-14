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
