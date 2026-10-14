import { cache } from "react";
import { resolveActiveBugs, type BugId } from "@/lib/bugs/registry";
import { prisma } from "@/lib/prisma";

// Lado servidor do Modo Bug: leitura e escrita da chave no banco.
// A configuração é global: vale para todos os usuários.

const BUG_MODE_KEY = "bugMode";

/** O Modo Bug está ligado? (uma consulta por requisição) */
export const getBugMode = cache(async () => {
  const setting = await prisma.setting.findUnique({
    where: { key: BUG_MODE_KEY },
  });
  return setting?.value === "true";
});

export async function setBugMode(enabled: boolean) {
  const value = String(enabled);
  await prisma.setting.upsert({
    where: { key: BUG_MODE_KEY },
    create: { key: BUG_MODE_KEY, value },
    update: { value },
  });
}

/** Ids dos bugs em vigor agora. */
export async function getActiveBugs(): Promise<BugId[]> {
  return resolveActiveBugs(await getBugMode());
}

/** Use nos pontos do servidor onde um defeito deve acontecer. */
export async function isBugActive(id: BugId) {
  return (await getActiveBugs()).includes(id);
}
