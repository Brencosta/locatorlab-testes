import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ActionResult } from "@/lib/action-result";

/** Copia os erros por campo devolvidos pelo servidor para o react-hook-form. */
export function applyFieldErrors<T extends FieldValues>(
  result: ActionResult,
  setError: UseFormSetError<T>,
) {
  if (result.success || !result.fieldErrors) return false;

  const entries = Object.entries(result.fieldErrors);
  entries.forEach(([field, message], index) => {
    setError(
      field as Path<T>,
      { type: "server", message },
      { shouldFocus: index === 0 },
    );
  });
  return entries.length > 0;
}
