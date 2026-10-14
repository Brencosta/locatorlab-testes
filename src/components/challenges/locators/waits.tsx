"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Panel, Result, ui } from "@/components/challenges/ui";

// Tempos fixos: o desafio é sempre igual.
const APPEAR_MS = 3000;
const DISAPPEAR_MS = 4000;
const PROCESSING_MS = 2000;
const DONE_MS = 5000;

type LoadState = "idle" | "loading" | "loaded";
type BannerState = "idle" | "visible" | "gone";
type ProcessState = "idle" | "queued" | "processing" | "done";

const PROCESS_TEXT: Record<ProcessState, string> = {
  idle: "Parado",
  queued: "Na fila",
  processing: "Processando...",
  done: "Concluído",
};

// Desafio 10: elementos que aparecem, somem e mudam de texto com atraso.
export function WaitsChallenge() {
  const [load, setLoad] = useState<LoadState>("idle");
  const [banner, setBanner] = useState<BannerState>("idle");
  const [continued, setContinued] = useState(false);
  const [process, setProcess] = useState<ProcessState>("idle");
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  function later(callback: () => void, ms: number) {
    timers.current.push(setTimeout(callback, ms));
  }

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel
        title="Aparece com atraso"
        description="A mensagem leva 3 segundos para chegar."
      >
        <button
          id="load-button"
          type="button"
          className={`${ui.button} ${ui.primary}`}
          disabled={load === "loading"}
          onClick={() => {
            setLoad("loading");
            later(() => setLoad("loaded"), APPEAR_MS);
          }}
        >
          Carregar dados
        </button>
        <div className="mt-3 min-h-10">
          {load === "loading" ? (
            <p
              id="loading-indicator"
              role="status"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Carregando...
            </p>
          ) : null}
          {load === "loaded" ? (
            <Result id="delayed-message" className="text-success">
              Dados carregados com sucesso!
            </Result>
          ) : null}
        </div>
      </Panel>

      <Panel
        title="Some depois de um tempo"
        description="O aviso sai do DOM depois de 4 segundos."
      >
        <button
          id="show-banner-button"
          type="button"
          className={`${ui.button} ${ui.primary}`}
          disabled={banner === "visible"}
          onClick={() => {
            setBanner("visible");
            setContinued(false);
            later(() => setBanner("gone"), DISAPPEAR_MS);
          }}
        >
          Mostrar aviso
        </button>
        <div className="mt-3 grid min-h-10 gap-2">
          {banner === "visible" ? (
            <p
              id="temporary-banner"
              role="alert"
              className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm"
            >
              Salvando alterações, aguarde...
            </p>
          ) : null}
          <div>
            <button
              id="continue-button"
              type="button"
              className={`${ui.button} ${ui.outline}`}
              disabled={banner !== "gone"}
              onClick={() => setContinued(true)}
            >
              Continuar
            </button>
          </div>
          {continued ? (
            <Result id="continue-result">Você continuou depois do aviso.</Result>
          ) : null}
        </div>
      </Panel>

      <Panel
        title="Muda de texto"
        description="O status muda aos 2 e aos 5 segundos."
      >
        <button
          id="start-process-button"
          type="button"
          className={`${ui.button} ${ui.primary}`}
          disabled={process === "queued" || process === "processing"}
          onClick={() => {
            setProcess("queued");
            later(() => setProcess("processing"), PROCESSING_MS);
            later(() => setProcess("done"), DONE_MS);
          }}
        >
          Iniciar processamento
        </button>
        <div className="mt-3">
          <Result id="process-status" data-state={process}>
            {PROCESS_TEXT[process]}
          </Result>
        </div>
      </Panel>
    </div>
  );
}
