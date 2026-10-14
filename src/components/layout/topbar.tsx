import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Logo } from "@/components/shared/logo";
import type { AppUser } from "@/lib/users";

export function Topbar({ user }: { user: AppUser }) {
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
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
