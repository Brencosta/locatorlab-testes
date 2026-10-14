import Link from "next/link";
import { Bug } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Logo } from "@/components/shared/logo";
import type { AppUser } from "@/lib/users";

export function Topbar({
  user,
  bugModeIndicator = false,
}: {
  user: AppUser;
  /** Aviso de Modo Bug ligado. O layout só passa true para admins. */
  bugModeIndicator?: boolean;
}) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur sm:px-6"
      data-testid="topbar"
    >
      <MobileNav role={user.role} />
      <Link
        href="/dashboard"
        className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
        aria-label="LocatorLab - ir para o dashboard"
      >
        <Logo />
      </Link>
      <div className="ml-auto flex items-center gap-1">
        {bugModeIndicator ? (
          <Link
            href="/admin"
            className="mr-1 inline-flex h-7 items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 text-xs font-medium text-destructive outline-none hover:bg-destructive/20 focus-visible:ring-3 focus-visible:ring-ring/50"
            data-testid="bug-mode-indicator"
          >
            <Bug className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Modo Bug ativo</span>
            <span className="sr-only sm:hidden">Modo Bug ativo</span>
          </Link>
        ) : null}
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
