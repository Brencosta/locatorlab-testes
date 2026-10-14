import { Crosshair, ListChecks, Server } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/shared/logo";

const HIGHLIGHTS = [
  {
    icon: Crosshair,
    title: "Localizadores",
    text: "Treine id, name, CSS, XPath, data-testid, texto e role/ARIA.",
  },
  {
    icon: ListChecks,
    title: "Assertions",
    text: "Valide texto, visibilidade, estado, atributos, URL e contagem de itens.",
  },
  {
    icon: Server,
    title: "API REST",
    text: "Pratique testes de API com respostas padronizadas e status codes reais.",
  },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-2">
      <aside
        className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex"
        aria-label="Sobre o LocatorLab"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]"
        />
        <div className="relative flex items-center gap-2 text-lg font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/15">
            <Crosshair className="size-5" aria-hidden="true" />
          </span>
          LocatorLab
        </div>
        <div className="relative space-y-8">
          <p className="max-w-md text-3xl leading-tight font-semibold tracking-tight">
            O laboratório para praticar automação de testes de verdade.
          </p>
          <ul className="space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-primary-foreground/80">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-primary-foreground/70">
          Selenium · Cypress · Playwright
        </p>
      </aside>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
