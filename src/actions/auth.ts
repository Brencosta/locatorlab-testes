"use server";

import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import { signIn, signOut } from "@/lib/auth";
import {
  UNEXPECTED_ERROR,
  validationFailure,
  type ActionResult,
} from "@/lib/action-result";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/users";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export async function loginAction(values: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
    return { success: true, message: "Login realizado com sucesso." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, message: "E-mail ou senha incorretos." };
    }
    console.error("[loginAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function registerAction(values: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return validationFailure(parsed.error);

  const { name, email, password } = parsed.data;
  const emailTaken: ActionResult = {
    success: false,
    message: "Não foi possível criar a conta.",
    fieldErrors: { email: "Este e-mail já está cadastrado." },
  };

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) return emailTaken;

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role: "STUDENT",
      },
    });

    await signIn("credentials", { email, password, redirect: false });
    return { success: true, message: "Conta criada com sucesso. Bem-vindo!" };
  } catch (error) {
    // Dois cadastros simultâneos com o mesmo e-mail.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return emailTaken;
    }
    console.error("[registerAction]", error);
    return UNEXPECTED_ERROR;
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await signOut({ redirect: false });
    return { success: true, message: "Você saiu da sua conta." };
  } catch (error) {
    console.error("[logoutAction]", error);
    return UNEXPECTED_ERROR;
  }
}
