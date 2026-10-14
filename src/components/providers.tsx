"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  // As páginas de /embed abrem dentro de um iframe ou em outra aba e não
  // usam toasts; sem o contêiner, a página principal não fica com dois.
  const embedded = usePathname().startsWith("/embed");

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
      {embedded ? null : (
        <Toaster position="top-center" richColors closeButton duration={4000} />
      )}
    </ThemeProvider>
  );
}
