"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "@/lib/notify";
import { ROLE_LABELS } from "@/lib/task-labels";
import type { AppUser } from "@/lib/users";

export function UserMenu({ user }: { user: AppUser }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const result = await logoutAction();
      notify.result(result);
      if (result.success) {
        router.push("/login");
        router.refresh();
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menu do usuário"
        data-testid="user-menu-trigger"
        className="flex items-center gap-2 rounded-lg p-1 pr-2 text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
        <span
          className="hidden max-w-40 truncate font-medium sm:block"
          data-testid="user-menu-name"
        >
          {user.name}
        </span>
        <ChevronDown
          className="hidden size-4 text-muted-foreground sm:block"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60"
        data-testid="user-menu"
      >
        <div className="flex flex-col gap-1 px-1.5 py-1.5">
          <span className="truncate text-sm font-medium">{user.name}</span>
          <span
            className="truncate text-xs text-muted-foreground"
            data-testid="user-menu-email"
          >
            {user.email}
          </span>
          <Badge
            variant="secondary"
            className="mt-1"
            data-testid="user-menu-role"
            data-role={user.role}
          >
            {ROLE_LABELS[user.role]}
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/profile" />}
          data-testid="user-menu-profile"
        >
          <UserRound aria-hidden="true" />
          Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          onClick={handleLogout}
          data-testid="logout-button"
        >
          <LogOut aria-hidden="true" />
          {pending ? "Saindo..." : "Sair"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
