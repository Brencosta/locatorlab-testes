"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav({
  role,
  onNavigate,
}: {
  role: "STUDENT" | "ADMIN";
  /** Chamado ao clicar em um link (usado para fechar o menu mobile). */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="flex flex-col gap-6"
      data-testid="main-nav"
    >
      {NAV_SECTIONS.map((section) => {
        const items = section.items.filter(
          (item) => !item.adminOnly || role === "ADMIN",
        );
        if (items.length === 0) return null;

        return (
          <div key={section.title} className="flex flex-col gap-1">
            <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      data-testid={item.testId}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 flex-1 leading-tight">{item.label}</span>
                      {item.soon ? (
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px] text-muted-foreground"
                        >
                          Em breve
                        </Badge>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
