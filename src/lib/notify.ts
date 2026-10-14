import { toast } from "sonner";
import type { ActionResult } from "@/lib/action-result";

// Todos os toasts passam por aqui para terem data-testid consistente:
// [data-testid="toast-success"] e [data-testid="toast-error"].
export const notify = {
  success(message: string) {
    toast.success(message, { testId: "toast-success" });
  },
  error(message: string) {
    toast.error(message, { testId: "toast-error" });
  },
  /** Mostra o toast correspondente ao resultado de uma Server Action. */
  result(result: ActionResult) {
    if (result.success) notify.success(result.message);
    else notify.error(result.message);
  },
};
