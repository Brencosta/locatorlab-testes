"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import {
  SESSION_EXPIRED,
  UNEXPECTED_ERROR,
  validationFailure,
  type ActionResult,
} from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { hashPassword } from "@/lib/users";
import {
  changePasswordSchema,
  profileSchema,
  validateAvatarFile,
} from "@/lib/validations/auth";

// O nome e o avatar aparecem no layout de toda a área logada.
function revalidateUser() {
  revalidatePath("/", "layout");
}

export async function updateProfileAction(
  values: unknown,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name, bio: parsed.data.bio || null },
    });
    revalidateUser();
    return { success: true, message: "Perfil atualizado com sucesso." };
  } catch (error) {
    console.error("[updateProfileAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function changePasswordAction(
  values: unknown,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    if (!row) return SESSION_EXPIRED;

    const matches = await bcrypt.compare(
      parsed.data.currentPassword,
      row.passwordHash,
    );
    if (!matches) {
      return {
        success: false,
        message: "Não foi possível alterar a senha.",
        fieldErrors: { currentPassword: "Senha atual incorreta." },
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data.newPassword) },
    });
    return { success: true, message: "Senha alterada com sucesso." };
  } catch (error) {
    console.error("[changePasswordAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function uploadAvatarAction(
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  const file = formData.get("avatar");
  if (!(file instanceof File)) {
    return { success: false, message: "Selecione uma imagem." };
  }

  const fileError = validateAvatarFile(file);
  if (fileError) return { success: false, message: fileError };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarData: new Uint8Array(await file.arrayBuffer()),
        avatarMime: file.type,
      },
    });
    revalidateUser();
    return { success: true, message: "Avatar atualizado com sucesso." };
  } catch (error) {
    console.error("[uploadAvatarAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function removeAvatarAction(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarData: null, avatarMime: null },
    });
    revalidateUser();
    return { success: true, message: "Avatar removido." };
  } catch (error) {
    console.error("[removeAvatarAction]", error);
    return UNEXPECTED_ERROR;
  }
}
