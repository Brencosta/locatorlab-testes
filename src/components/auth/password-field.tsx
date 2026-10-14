"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Campo de senha com botão de mostrar/ocultar. */
export function PasswordField({
  id,
  label,
  testId,
  error,
  hint,
  ...props
}: {
  id: string;
  label: string;
  testId: string;
  error?: string;
  hint?: string;
} & Omit<React.ComponentProps<"input">, "id" | "type">) {
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="grid gap-1.5" data-testid={`${testId}-field`}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className="pr-9"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-testid={`${testId}-input`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          aria-controls={id}
          data-testid={`${testId}-toggle`}
          className="absolute top-1/2 right-1 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm text-destructive"
          data-testid={`${testId}-error`}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
