"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Respeita "reduzir movimento" do sistema operacional. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      {/* No topo e ao centro para não cobrir o menu do usuário nem a paginação. */}
      <Toaster position="top-center" richColors closeButton duration={4000} />
    </ThemeProvider>
  );
}
