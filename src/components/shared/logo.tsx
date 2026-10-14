import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  testId = "app-logo",
}: {
  className?: string;
  testId?: string;
}) {
  return (
    <span
      className={cn("flex items-center gap-2 font-semibold", className)}
      data-testid={testId}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Crosshair className="size-4.5" aria-hidden="true" />
      </span>
      <span className="text-base tracking-tight">LocatorLab</span>
    </span>
  );
}
