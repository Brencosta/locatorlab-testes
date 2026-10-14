import { Badge } from "@/components/ui/badge";
import { LEVEL_LABELS, type ChallengeLevel } from "@/lib/challenges/shared";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<ChallengeLevel, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-destructive/10 text-destructive",
};

export function LevelBadge({
  level,
  testId,
}: {
  level: ChallengeLevel;
  testId?: string;
}) {
  return (
    <Badge
      className={cn(LEVEL_STYLES[level])}
      data-level={level}
      data-testid={testId}
    >
      {LEVEL_LABELS[level]}
    </Badge>
  );
}
