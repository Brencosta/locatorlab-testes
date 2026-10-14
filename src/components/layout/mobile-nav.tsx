"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav({ role }: { role: "STUDENT" | "ADMIN" }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu de navegação"
            data-testid="mobile-nav-trigger"
          />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0" data-testid="mobile-nav">
        <SheetHeader className="border-b p-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription className="sr-only">
            Menu de navegação do LocatorLab
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-3 pb-4">
          <SidebarNav role={role} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
