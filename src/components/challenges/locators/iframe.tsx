"use client";

import { useState } from "react";
import { Panel, Result, ui } from "@/components/challenges/ui";

// Desafio 8: o formulário de inscrição é outro documento (/embed/iframe-form),
// carregado em um iframe. Fora dele há um campo de e-mail parecido.
export function IframeChallenge() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Você ainda não assinou a newsletter.");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      email.trim()
        ? `Newsletter assinada para ${email.trim()}.`
        : "Informe um e-mail para assinar.",
    );
  }

  return (
    <div className="grid gap-4">
      <Panel
        title="Página principal"
        description="Este bloco está fora do iframe."
      >
        <form
          id="newsletter-form"
          className="flex flex-wrap items-end gap-2"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid min-w-56 flex-1 gap-1.5">
            <label htmlFor="newsletter-email" className={ui.label}>
              E-mail para novidades
            </label>
            <input
              id="newsletter-email"
              name="newsletterEmail"
              type="email"
              autoComplete="off"
              className={ui.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <button
            id="newsletter-submit"
            type="submit"
            className={`${ui.button} ${ui.outline}`}
          >
            Assinar
          </button>
        </form>
        <Result id="newsletter-result" className="mt-3">
          {message}
        </Result>
      </Panel>

      <Panel
        title="Iframe"
        description="O conteúdo abaixo é outro documento HTML."
      >
        <iframe
          id="signup-frame"
          name="inscricao"
          title="Formulário de inscrição"
          src="/embed/iframe-form"
          className="h-[27rem] w-full rounded-lg border bg-background"
        />
      </Panel>
    </div>
  );
}
