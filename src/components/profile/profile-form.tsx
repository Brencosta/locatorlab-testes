"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProfileAction } from "@/actions/profile";
import { FormAlert } from "@/components/shared/form-alert";
import { TextareaField, TextField } from "@/components/shared/form-fields";
import { SubmitButton } from "@/components/shared/submit-button";
import { applyFieldErrors } from "@/lib/form-errors";
import { notify } from "@/lib/notify";
import type { AppUser } from "@/lib/users";
import { profileSchema, type ProfileValues } from "@/lib/validations/auth";

export function ProfileForm({ user }: { user: AppUser }) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, bio: user.bio ?? "" },
  });

  function onSubmit(values: ProfileValues) {
    setFormError(null);
    startTransition(async () => {
      const result = await updateProfileAction(values);

      if (result.success) {
        notify.success(result.message);
        reset({ name: values.name.trim(), bio: values.bio.trim() });
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
      aria-label="Dados pessoais"
      className="grid gap-4"
      data-testid="profile-form"
    >
      <FormAlert message={formError} testId="profile-error-message" />

      <TextField
        id="name"
        label="Nome completo"
        autoComplete="name"
        testId="profile-name"
        error={errors.name?.message}
        {...register("name")}
      />

      <TextField
        id="email"
        name="email"
        label="E-mail"
        type="email"
        value={user.email}
        disabled
        readOnly
        testId="profile-email"
        hint="O e-mail não pode ser alterado."
      />

      <TextareaField
        id="bio"
        label="Bio"
        rows={3}
        placeholder="Conte um pouco sobre você"
        testId="profile-bio"
        hint="Até 200 caracteres."
        error={errors.bio?.message}
        {...register("bio")}
      />

      <div>
        <SubmitButton
          pending={pending}
          pendingLabel="Salvando..."
          disabled={pending || !isDirty}
          data-testid="profile-submit-button"
        >
          Salvar alterações
        </SubmitButton>
      </div>
    </form>
  );
}
