import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Campos de formulário com label, dica e mensagem de erro já associados
// (htmlFor, aria-invalid, aria-describedby) e data-testid padronizado:
//   {testId}-field, {testId}-input e {testId}-error

type FieldShellProps = {
  id: string;
  label: string;
  testId: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

function FieldShell({
  id,
  label,
  testId,
  error,
  hint,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("grid gap-1.5", className)} data-testid={`${testId}-field`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
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

type CommonProps = {
  id: string;
  label: string;
  testId: string;
  error?: string;
  hint?: string;
  fieldClassName?: string;
};

export function TextField({
  id,
  label,
  testId,
  error,
  hint,
  fieldClassName,
  ...props
}: CommonProps & Omit<React.ComponentProps<"input">, "id">) {
  return (
    <FieldShell
      id={id}
      label={label}
      testId={testId}
      error={error}
      hint={hint}
      className={fieldClassName}
    >
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        data-testid={`${testId}-input`}
        {...props}
      />
    </FieldShell>
  );
}

export function TextareaField({
  id,
  label,
  testId,
  error,
  hint,
  fieldClassName,
  ...props
}: CommonProps & Omit<React.ComponentProps<"textarea">, "id">) {
  return (
    <FieldShell
      id={id}
      label={label}
      testId={testId}
      error={error}
      hint={hint}
      className={fieldClassName}
    >
      <Textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        data-testid={`${testId}-input`}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  testId,
  error,
  hint,
  fieldClassName,
  children,
  ...props
}: CommonProps & Omit<React.ComponentProps<"select">, "id">) {
  return (
    <FieldShell
      id={id}
      label={label}
      testId={testId}
      error={error}
      hint={hint}
      className={fieldClassName}
    >
      <NativeSelect
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        data-testid={`${testId}-input`}
        {...props}
      >
        {children}
      </NativeSelect>
    </FieldShell>
  );
}
