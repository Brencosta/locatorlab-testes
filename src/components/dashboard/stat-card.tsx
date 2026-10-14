import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
  testId,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: keyof typeof TONES;
  href: string;
  testId: string;
}) {
  return (
    <Link
      href={href}
      data-testid={testId}
      aria-label={`${label}: ${value}`}
      className="group flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow outline-none hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          TONES[tone],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm text-muted-foreground">
          {label}
        </span>
        <span
          className="block text-2xl leading-tight font-semibold tabular-nums"
          data-testid={`${testId}-value`}
        >
          {value}
        </span>
      </span>
    </Link>
  );
}
