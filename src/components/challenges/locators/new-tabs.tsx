"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Panel, Result, ui } from "@/components/challenges/ui";
import {
  NEW_TAB_CHANNEL,
  NEW_TAB_PATH,
  type NewTabMessage,
} from "@/lib/challenges/new-tab";

const SOURCE_LABELS: Record<string, string> = {
  link: "nova aba",
  popup: "pop-up",
};

// Desafio 18: a outra aba avisa esta página (via BroadcastChannel) quando o
// aluno clica em "Confirmar leitura".
export function NewTabsChallenge() {
  const [message, setMessage] = useState("Aguardando confirmação da outra aba.");
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    const channel = new BroadcastChannel(NEW_TAB_CHANNEL);
    channel.onmessage = (event: MessageEvent<NewTabMessage>) => {
      const origin = SOURCE_LABELS[event.data.source] ?? "outra janela";
      setMessage(
        `Confirmação recebida: comprovante ${event.data.code} (via ${origin}).`,
      );
      setConfirmations((current) => current + 1);
    };
    return () => channel.close();
  }, []);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel
          title="Link com target=&quot;_blank&quot;"
          description="Abre o comprovante em uma nova aba."
        >
          <a
            id="open-tab-link"
            href={`${NEW_TAB_PATH}?source=link`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Abrir comprovante em nova aba
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </Panel>

        <Panel
          title="Janela pop-up"
          description="Abre o mesmo conteúdo com window.open."
        >
          <button
            id="open-popup-button"
            type="button"
            className={`${ui.button} ${ui.outline}`}
            onClick={() =>
              window.open(
                `${NEW_TAB_PATH}?source=popup`,
                "locatorlab-popup",
                "width=520,height=520",
              )
            }
          >
            Abrir comprovante em pop-up
          </button>
        </Panel>
      </div>

      <Result id="tab-result" data-confirmations={confirmations}>
        {message}
      </Result>
    </div>
  );
}
