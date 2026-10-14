"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { removeAvatarAction, uploadAvatarAction } from "@/actions/profile";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/notify";
import type { AppUser } from "@/lib/users";
import { AVATAR_MIME_TYPES, validateAvatarFile } from "@/lib/validations/auth";

export function AvatarUpload({ user }: { user: AppUser }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [removing, startRemove] = useTransition();
  const busy = uploading || removing;

  // Libera a URL temporária da prévia quando ela deixa de ser usada.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function clearSelection() {
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setError(null);

    if (!selected) {
      clearSelection();
      return;
    }

    // Mesma validação que o servidor aplica.
    const fileError = validateAvatarFile(selected);
    if (fileError) {
      setError(fileError);
      clearSelection();
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Selecione uma imagem.");
      return;
    }

    startUpload(async () => {
      const formData = new FormData();
      formData.set("avatar", file);
      const result = await uploadAvatarAction(formData);
      notify.result(result);
      if (result.success) clearSelection();
      else setError(result.message);
    });
  }

  function handleRemove() {
    setError(null);
    startRemove(async () => {
      const result = await removeAvatarAction();
      notify.result(result);
      if (result.success) clearSelection();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Foto de perfil"
      className="flex flex-col gap-4 sm:flex-row sm:items-start"
      data-testid="avatar-form"
    >
      <UserAvatar
        name={user.name}
        avatarUrl={previewUrl ?? user.avatarUrl}
        className="size-20 text-xl"
        testId="profile-avatar"
      />

      <div className="grid min-w-0 flex-1 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="avatar">Imagem do avatar</Label>
          <input
            ref={inputRef}
            id="avatar"
            name="avatar"
            type="file"
            accept={AVATAR_MIME_TYPES.join(",")}
            onChange={handleFileChange}
            disabled={busy}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "avatar-error" : "avatar-hint"}
            data-testid="profile-avatar-input"
            className="block w-full min-w-0 cursor-pointer rounded-lg border border-input text-sm text-muted-foreground outline-none file:mr-3 file:cursor-pointer file:border-0 file:border-r file:border-input file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
          />
          {error ? (
            <p
              id="avatar-error"
              role="alert"
              className="text-sm text-destructive"
              data-testid="profile-avatar-error"
            >
              {error}
            </p>
          ) : (
            <p id="avatar-hint" className="text-xs text-muted-foreground">
              PNG, JPG ou WebP, com até 1 MB.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={busy || !file}
            aria-busy={uploading}
            data-testid="profile-avatar-upload-button"
          >
            {uploading ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Upload aria-hidden="true" />
            )}
            {uploading ? "Enviando..." : "Enviar imagem"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            disabled={busy || !user.avatarUrl}
            aria-busy={removing}
            data-testid="profile-avatar-remove-button"
          >
            {removing ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 aria-hidden="true" />
            )}
            {removing ? "Removendo..." : "Remover"}
          </Button>
        </div>
      </div>
    </form>
  );
}
