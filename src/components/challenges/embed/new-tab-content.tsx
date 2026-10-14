"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { Result, ui } from "@/components/challenges/ui";
import {
  NEW_TAB_CHANNEL,
  RECEIPT_CODE,
  type NewTabMessage,
} from "@/lib/challenges/new-tab";

/** Página aberta em outra aba (ou pop-up) pelo desafio 18. */
export function NewTabContent({ source }: { source: string }) {
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirm() {
    const channel = new BroadcastChannel(NEW_TAB_CHANNEL);
    const message: NewTabMessage = { code: RECEIPT_CODE, source };
    channel.postMessage(message);
    channel.close();
    setConfirmed(true);
  }

  return (
    <main className="mx-auto grid max-w-md gap-4 py-6">
      <div className="space-y-1">
        <h1 id="receipt-title" className="text-xl font-semibold">
          Comprovante de inscrição
        </h1>
        <p className="text-sm text-muted-foreground">
          Esta página foi aberta em{" "}
          <span id="receipt-source">
            {source === "popup" ? "uma janela pop-up" : "uma nova aba"}
          </span>
          .
        </p>
      </div>

      <dl className="grid gap-2 rounded-xl border p-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Código</dt>
          <dd id="receipt-code" className="font-mono font-semibold">
            {RECEIPT_CODE}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Curso</dt>
          <dd id="receipt-course">Automação de testes</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Situação</dt>
          <dd id="receipt-status">{confirmed ? "Lido" : "Pendente de leitura"}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          id="confirm-reading"
          type="button"
          className={`${ui.button} ${ui.primary}`}
          disabled={confirmed}
          onClick={handleConfirm}
        >
          Confirmar leitura
        </button>
        <button
          id="close-window"
          type="button"
          className={`${ui.button} ${ui.outline}`}
          onClick={() => window.close()}
        >
          Fechar janela
        </button>
      </div>

      {confirmed ? (
        <Result id="receipt-confirmation" className="flex items-center gap-2 text-success">
          <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
          Leitura confirmada! Volte para a aba do desafio.
        </Result>
      ) : null}
    </main>
  );
}
