import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Botão de envio com estado de carregamento (disabled + aria-busy). */
export function SubmitButton({
  pending,
  pendingLabel,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  pending: boolean;
  pendingLabel: string;
}) {
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
