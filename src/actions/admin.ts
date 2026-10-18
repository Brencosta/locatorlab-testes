"use server";

import { revalidatePath } from "next/cache";
import {
  ADMIN_ONLY,
  UNEXPECTED_ERROR,
  type ActionResult,
} from "@/lib/action-result";
import { setBugMode } from "@/lib/bugs/server";
import { prisma } from "@/lib/prisma";
import { resetDatabase, SeedConfigError } from "@/lib/seed-data";
import { getCurrentAdmin } from "@/lib/session";

// Ações do painel do professor. Toda ação confere a permissão aqui, no
// servidor: esconder o painel na interface não protege nada.

export async function setBugModeAction(enabled: unknown): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return ADMIN_ONLY;

  if (typeof enabled !== "boolean") {
    return { success: false, message: "Valor inválido para o Modo Bug." };
  }

  try {
    await setBugMode(enabled);
    revalidatePath("/", "layout");
    return {
      success: true,
      message: enabled ? "Modo Bug ativado." : "Modo Bug desativado.",
    };
  } catch (error) {
    console.error("[setBugModeAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function resetDatabaseAction(): Promise<ActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return ADMIN_ONLY;

  try {
    const counts = await resetDatabase(prisma);
    revalidatePath("/", "layout");
    return {
      success: true,
      message: `Banco restaurado: ${counts.users} usuários e ${counts.tasks} tarefas.`,
    };
  } catch (error) {
    if (error instanceof SeedConfigError) {
      return { success: false, message: error.message };
    }
    console.error("[resetDatabaseAction]", error);
    return UNEXPECTED_ERROR;
  }
}
