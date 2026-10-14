"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Panel, ui } from "@/components/challenges/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cores fixas (iguais nos temas claro e escuro) para as assertions de CSS.
const ERROR_COLOR = "rgb(220, 38, 38)";
const SUCCESS_COLOR = "rgb(22, 163, 74)";

// Avatar desenhado em SVG e embutido como data URI: não depende de rede.
const AVATAR_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="24" fill="#4f46e5"/><text x="24" y="31" font-family="Arial,sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="#fff">MS</text></svg>',
  );

type FieldState = "idle" | "error" | "success";

const PROGRESS_STEP = 25;

// Desafio 4 de assertions: classes, estilos calculados e atributos.
export function AttributesAndClassesChallenge() {
  const [email, setEmail] = useState("");
  const [field, setField] = useState<{ state: FieldState; message: string }>({
    state: "idle",
    message: "Clique em Validar para conferir o e-mail.",
  });
  const [progress, setProgress] = useState(0);
  const [approved, setApproved] = useState(false);

  function validate() {
    const value = email.trim();
    if (value === "") {
      setField({ state: "error", message: "Informe o e-mail." });
    } else if (!EMAIL_PATTERN.test(value)) {
      setField({ state: "error", message: "E-mail inválido." });
    } else {
      setField({ state: "success", message: "E-mail válido." });
    }
  }

  const fieldClass =
    field.state === "error"
      ? "input-error"
      : field.state === "success"
        ? "input-success"
        : "";
  const fieldColor =
    field.state === "error"
      ? ERROR_COLOR
      : field.state === "success"
        ? SUCCESS_COLOR
        : undefined;
  const progressStatus =
    progress === 0 ? "idle" : progress === 100 ? "complete" : "in-progress";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="Campo com validação"
        description="A classe, o aria-invalid e a cor da borda mudam ao validar."
      >
        <form
          id="email-form"
          className="grid gap-3"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            validate();
          }}
        >
          <div className="grid gap-1.5">
            <label htmlFor="email-field" className={ui.label}>
              E-mail
            </label>
            <input
              id="email-field"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="voce@exemplo.com"
              data-state={field.state}
              aria-invalid={field.state === "error"}
              aria-describedby="email-message"
              // transition-none: a cor da borda muda na hora, para a assertion
              // de CSS não pegar um valor intermediário da animação.
              className={`form-control ${fieldClass} ${ui.input} transition-none`.replace(/\s+/g, " ")}
              style={fieldColor ? { borderColor: fieldColor } : undefined}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <p
              id="email-message"
              className={`message-${field.state} text-sm`}
              style={fieldColor ? { color: fieldColor } : undefined}
            >
              {field.message}
            </p>
          </div>
          <div>
            <button
              id="validate-email"
              type="submit"
              className={`${ui.button} ${ui.primary}`}
            >
              Validar
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="Link e imagem" description="Atributos href, target, rel e alt.">
        <div className="grid gap-4">
          <a
            id="docs-link"
            href="https://playwright.dev/docs/locators"
            target="_blank"
            rel="noopener noreferrer"
            title="Abre em uma nova aba"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Documentação de localizadores
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>

          <div className="flex items-center gap-3">
            {/* <img> comum de propósito: o desafio é validar src, alt, width e height. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              id="avatar-image"
              src={AVATAR_SRC}
              alt="Foto de perfil de Maria Souza"
              width={48}
              height={48}
              loading="lazy"
              className="rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium">Maria Souza</p>
              <p className="text-muted-foreground">Analista de QA</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        title="Barra de progresso"
        description="Cada clique avança 25%."
      >
        <div
          id="upload-progress"
          role="progressbar"
          aria-label="Progresso do envio"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          data-status={progressStatus}
          className={`progress h-3 overflow-hidden rounded-full bg-muted ${
            progress === 100 ? "progress-complete" : ""
          }`.trim()}
        >
          <div
            id="upload-progress-fill"
            className="progress-fill h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: progress === 100 ? SUCCESS_COLOR : "rgb(79, 70, 229)",
            }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            id="advance-progress"
            type="button"
            className={`${ui.button} ${ui.outline}`}
            disabled={progress === 100}
            onClick={() => setProgress(Math.min(100, progress + PROGRESS_STEP))}
          >
            Avançar
          </button>
          <span id="progress-label" className="text-sm tabular-nums">
            {progress}%{progress === 100 ? " concluído" : ""}
          </span>
        </div>
      </Panel>

      <Panel
        title="Selo de status"
        description="A classe e o data-status mudam ao aprovar."
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm">Pedido nº 4821</span>
          <span
            id="order-badge"
            data-status={approved ? "approved" : "pending"}
            className={`badge ${
              approved
                ? "badge-approved bg-success/10 text-success"
                : "badge-pending bg-warning/10 text-warning"
            } rounded-full px-2.5 py-0.5 text-xs font-medium`}
          >
            {approved ? "Aprovado" : "Pendente"}
          </span>
        </div>
        <button
          id="approve-order"
          type="button"
          className={`${ui.button} ${ui.outline} mt-3`}
          disabled={approved}
          onClick={() => setApproved(true)}
        >
          Aprovar pedido
        </button>
      </Panel>
    </div>
  );
}
