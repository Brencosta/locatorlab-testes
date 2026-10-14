"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePasswordAction } from "@/actions/profile";
import { PasswordField } from "@/components/auth/password-field";
import { FormAlert } from "@/components/shared/form-alert";
import { SubmitButton } from "@/components/shared/submit-button";
import { applyFieldErrors } from "@/lib/form-errors";
import { notify } from "@/lib/notify";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validations/auth";

export function PasswordForm() {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit(values: ChangePasswordValues) {
    setFormError(null);
    startTransition(async () => {
      const result = await changePasswordAction(values);

      if (result.success) {
        notify.success(result.message);
        reset();
        return;
      }

      if (!applyFieldErrors(result, setError)) setFormError(result.message);
      notify.error(result.message);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Alterar senha"
      className="grid gap-4"
      data-testid="password-form"
    >
      <FormAlert message={formError} testId="password-error-message" />

      <PasswordField
        id="currentPassword"
        label="Senha atual"
        autoComplete="current-password"
        testId="password-current"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />

      <PasswordField
        id="newPassword"
        label="Nova senha"
        autoComplete="new-password"
        testId="password-new"
        hint="Mínimo de 8 caracteres, com letras e números."
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <PasswordField
        id="confirmNewPassword"
        label="Confirmar nova senha"
        autoComplete="new-password"
        testId="password-confirm"
        error={errors.confirmNewPassword?.message}
        {...register("confirmNewPassword")}
      />

      <div>
        <SubmitButton
          pending={pending}
          pendingLabel="Alterando..."
          data-testid="password-submit-button"
        >
          Alterar senha
        </SubmitButton>
      </div>
    </form>
  );
}
