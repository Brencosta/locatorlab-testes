"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginAction } from "@/actions/auth";
import { PasswordField } from "@/components/auth/password-field";
import { FormAlert } from "@/components/shared/form-alert";
import { TextField } from "@/components/shared/form-fields";
import { SubmitButton } from "@/components/shared/submit-button";
import { applyFieldErrors } from "@/lib/form-errors";
import { notify } from "@/lib/notify";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    setFormError(null);
    startTransition(async () => {
      const result = await loginAction(values);

      if (result.success) {
        notify.success(result.message);
        router.push(callbackUrl);
        router.refresh();
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
      aria-label="Formulário de login"
      className="grid gap-4"
      data-testid="login-form"
    >
      <FormAlert message={formError} testId="login-error-message" />

      <TextField
        id="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@exemplo.com"
        testId="login-email"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        id="password"
        label="Senha"
        autoComplete="current-password"
        placeholder="Sua senha"
        testId="login-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <SubmitButton
        pending={pending}
        pendingLabel="Entrando..."
        size="lg"
        data-testid="login-submit-button"
      >
        Entrar
      </SubmitButton>
    </form>
  );
}
