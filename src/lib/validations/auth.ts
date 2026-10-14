import { z } from "zod";

const emailField = z
  .string({ error: "Informe o e-mail." })
  .trim()
  .toLowerCase()
  .min(1, "Informe o e-mail.")
  .pipe(z.email("E-mail inválido."));

export const loginSchema = z.object({
  email: emailField,
  password: z.string({ error: "Informe a senha." }).min(1, "Informe a senha."),
});

export type LoginValues = z.infer<typeof loginSchema>;

const newPasswordField = z
  .string({ error: "Informe a senha." })
  .min(1, "Informe a senha.")
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .max(72, "A senha deve ter no máximo 72 caracteres.")
  .regex(/[A-Za-z]/, "A senha deve conter pelo menos uma letra.")
  .regex(/\d/, "A senha deve conter pelo menos um número.");

const nameField = z
  .string({ error: "Informe o nome." })
  .trim()
  .min(1, "Informe o nome.")
  .min(2, "O nome deve ter pelo menos 2 caracteres.")
  .max(60, "O nome deve ter no máximo 60 caracteres.");

export const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: newPasswordField,
    confirmPassword: z
      .string({ error: "Confirme a senha." })
      .min(1, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  name: nameField,
  bio: z
    .string({ error: "Bio inválida." })
    .trim()
    .max(200, "A bio deve ter no máximo 200 caracteres."),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: "Informe a senha atual." })
      .min(1, "Informe a senha atual."),
    newPassword: newPasswordField,
    confirmNewPassword: z
      .string({ error: "Confirme a nova senha." })
      .min(1, "Confirme a nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "As senhas não coincidem.",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const AVATAR_MAX_BYTES = 1024 * 1024;
export const AVATAR_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

/** Retorna a mensagem de erro do arquivo de avatar, ou null se for válido. */
export function validateAvatarFile(file: { type: string; size: number }) {
  if (!AVATAR_MIME_TYPES.includes(file.type)) {
    return "Formato inválido. Envie uma imagem PNG, JPG ou WebP.";
  }
  if (file.size === 0) {
    return "O arquivo está vazio.";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "A imagem deve ter no máximo 1 MB.";
  }
  return null;
}
