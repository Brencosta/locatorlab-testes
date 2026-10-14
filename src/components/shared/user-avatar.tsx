import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

export function UserAvatar({
  name,
  avatarUrl,
  className,
  testId = "user-avatar",
}: {
  name: string;
  avatarUrl: string | null;
  className?: string;
  testId?: string;
}) {
  return (
    <Avatar className={className} data-testid={testId}>
      {avatarUrl ? (
        <AvatarImage
          src={avatarUrl}
          alt={`Avatar de ${name}`}
          data-testid={`${testId}-image`}
        />
      ) : null}
      <AvatarFallback
        className={cn("bg-primary/10 font-medium text-primary")}
        data-testid={`${testId}-fallback`}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
