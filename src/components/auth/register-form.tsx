"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerAction } from "@/actions/auth";
import { PasswordField } from "@/components/auth/password-field";
import { FormAlert } from "@/components/shared/form-alert";
import { TextField } from "@/components/shared/form-fields";
import { SubmitButton } from "@/components/shared/submit-button";
import { applyFieldErrors } from "@/lib/form-errors";
import { notify } from "@/lib/notify";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: RegisterValues) {
    setFormError(null);
    startTransition(async () => {
      const result = await registerAction(values);

      if (result.success) {
        notify.success(result.message);
        router.push("/dashboard");
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
      aria-label="Formulário de cadastro"
      className="grid gap-4"
      data-testid="register-form"
    >
      <FormAlert message={formError} testId="register-error-message" />

      <TextField
        id="name"
        label="Nome completo"
        autoComplete="name"
        placeholder="Seu nome"
        testId="register-name"
        error={errors.name?.message}
        {...register("name")}
      />

      <TextField
        id="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@exemplo.com"
        testId="register-email"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        id="password"
        label="Senha"
        autoComplete="new-password"
        testId="register-password"
        hint="Mínimo de 8 caracteres, com letras e números."
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirmar senha"
        autoComplete="new-password"
        testId="register-confirm-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <SubmitButton
        pending={pending}
        pendingLabel="Criando conta..."
        size="lg"
        data-testid="register-submit-button"
      >
        Criar conta
      </SubmitButton>
    </form>
  );
}
