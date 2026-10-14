import Link from "next/link";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";
import { Logo } from "@/components/shared/logo";
import { getBugMode } from "@/lib/bugs/server";
import { getCurrentUser } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  // O proxy já barra quem não tem cookie; aqui conferimos o usuário no banco.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // O aviso de Modo Bug existe só para o admin. Para o aluno, nada é
  // consultado nem enviado ao navegador.
  const bugModeIndicator = user.role === "ADMIN" ? await getBugMode() : false;

  return (
    <div className="flex min-h-screen flex-1">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>

      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-sidebar lg:flex"
        data-testid="sidebar"
      >
        <div className="flex h-14 items-center border-b px-5">
          <Link
            href="/dashboard"
            className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="LocatorLab - ir para o dashboard"
          >
            <Logo testId="sidebar-logo" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <SidebarNav role={user.role} />
        </div>
        <p className="border-t px-5 py-3 text-xs text-muted-foreground">
          Ambiente de prática para automação de testes
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar user={user} bugModeIndicator={bugModeIndicator} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
