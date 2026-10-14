"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Result, ui } from "@/components/challenges/ui";
import {
  parseStoreSection,
  STORE_SECTIONS,
  type StoreSection,
} from "@/lib/challenges/url-and-title";

const NAV: StoreSection[] = ["inicio", "pedidos", "perfil"];
const ORDER_NUMBER = "4821";

function hrefFor(pathname: string, section: StoreSection) {
  return section === "inicio" ? pathname : `${pathname}?section=${section}`;
}

// Desafio 5 de assertions: mini loja em que cada navegação muda a query
// string da URL. O título da aba é definido no servidor, em generateMetadata
// de app/(app)/challenges/assertions/[slug]/page.tsx.
function Store() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const section = parseStoreSection(searchParams.get("section"));
  const order = searchParams.get("pedido");
  const from = searchParams.get("from");
  const query = searchParams.toString();

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-xl border">
        <nav
          id="store-nav"
          aria-label="Loja Demo"
          className="flex flex-wrap items-center gap-1 border-b bg-muted/40 px-3 py-2"
        >
          <span className="mr-2 text-sm font-semibold">Loja Demo</span>
          {NAV.map((item) => (
            <Link
              key={item}
              id={`nav-${item}`}
              href={hrefFor(pathname, item)}
              scroll={false}
              aria-current={section === item ? "page" : undefined}
              className="rounded-md px-2.5 py-1 text-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:bg-background aria-[current=page]:font-medium aria-[current=page]:text-foreground aria-[current=page]:shadow-xs"
            >
              {STORE_SECTIONS[item].label}
            </Link>
          ))}
        </nav>

        <div className="grid min-h-48 content-start gap-3 p-4" data-section={section}>
          <h3 id="section-title" className="text-lg font-semibold">
            {STORE_SECTIONS[section].label}
          </h3>

          {section === "inicio" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Bem-vindo à Loja Demo. Use o menu para navegar e observe a URL
                e o título da aba.
              </p>
              <div>
                <button
                  id="checkout-button"
                  type="button"
                  className={`${ui.button} ${ui.primary}`}
                  // Simula uma página protegida: quem tenta pagar sem estar
                  // logado na loja é mandado para o login.
                  onClick={() =>
                    router.push(`${pathname}?section=login&from=pagamento`, {
                      scroll: false,
                    })
                  }
                >
                  Ir para pagamento
                </button>
              </div>
            </>
          ) : null}

          {section === "pedidos" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Você tem 1 pedido em andamento.
              </p>
              <div>
                <Link
                  id="order-details-link"
                  href={`${pathname}?section=pedidos&pedido=${ORDER_NUMBER}#detalhes`}
                  scroll={false}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Ver detalhes do pedido {ORDER_NUMBER}
                </Link>
              </div>
              {order ? (
                <div id="detalhes" className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium">
                    Pedido nº <span id="order-number">{order}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Teclado mecânico · enviado em 12/03/2025
                  </p>
                </div>
              ) : null}
            </>
          ) : null}

          {section === "perfil" ? (
            <dl className="grid gap-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Nome:</dt>
                <dd id="profile-name">Maria Souza</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Cliente desde:</dt>
                <dd id="profile-since">2022</dd>
              </div>
            </dl>
          ) : null}

          {section === "login" ? (
            <p id="login-notice" role="alert" className="text-sm">
              {from === "pagamento"
                ? "Faça login para continuar para o pagamento."
                : "Faça login para acessar sua conta."}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          id="back-button"
          type="button"
          className={`${ui.button} ${ui.outline}`}
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar
        </button>
        <Result id="current-location" className="min-w-0 flex-1 font-mono text-xs break-all">
          {query ? `${pathname}?${query}` : pathname}
        </Result>
      </div>
    </div>
  );
}

export function UrlAndTitleChallenge() {
  return (
    <Suspense fallback={null}>
      <Store />
    </Suspense>
  );
}
