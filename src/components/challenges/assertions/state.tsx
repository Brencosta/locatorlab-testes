"use client";

import { useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import { Panel, Result, ui } from "@/components/challenges/ui";

const INITIAL_NAME = "Maria Souza";

const FREQUENCIES = [
  { value: "daily", label: "Diária" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
];

const LANGUAGES = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

const TABS = [
  { id: "general", label: "Geral", text: "Preferências gerais da conta." },
  { id: "security", label: "Segurança", text: "Senha e verificação em duas etapas." },
  { id: "billing", label: "Cobrança", text: "Plano atual e forma de pagamento." },
];

// Desafio 3 de assertions: habilitado, desabilitado, somente leitura, marcado
// e selecionado.
export function StateChallenge() {
  const [name, setName] = useState(INITIAL_NAME);
  const [remember, setRemember] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [language, setLanguage] = useState("pt-BR");
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("Nenhuma alteração salva.");
  const [tab, setTab] = useState("general");

  const dirty = name.trim() !== "" && name !== INITIAL_NAME;
  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Panel
        title="Preferências"
        description="O botão Salvar só habilita quando o nome muda."
      >
        <form
          id="preferences-form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(`Preferências salvas para ${name.trim()}.`);
          }}
        >
          {/* fieldset disabled desabilita todos os controles de uma vez. */}
          <fieldset id="preferences-fieldset" disabled={locked} className="grid gap-4">
            <legend className="sr-only">Preferências da conta</legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <label htmlFor="display-name" className={ui.label}>
                  Nome de exibição
                </label>
                <input
                  id="display-name"
                  name="displayName"
                  type="text"
                  autoComplete="off"
                  className={ui.input}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="account-code" className={ui.label}>
                  Código da conta
                </label>
                <input
                  id="account-code"
                  name="accountCode"
                  type="text"
                  readOnly
                  className={`${ui.input} bg-muted/50`}
                  value="ACC-2048"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="remember" className="flex items-center gap-2 text-sm">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className={ui.check}
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Lembrar de mim
              </label>
              <label htmlFor="marketing" className="flex items-center gap-2 text-sm">
                <input
                  id="marketing"
                  name="marketing"
                  type="checkbox"
                  className={ui.check}
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
                Receber novidades
              </label>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="frequency-label"
              className="grid gap-2"
            >
              <span id="frequency-label" className={ui.label}>
                Frequência do resumo
              </span>
              <div className="flex flex-wrap gap-4">
                {FREQUENCIES.map((item) => (
                  <label
                    key={item.value}
                    htmlFor={`frequency-${item.value}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      id={`frequency-${item.value}`}
                      name="frequency"
                      type="radio"
                      value={item.value}
                      className={ui.check}
                      checked={frequency === item.value}
                      onChange={() => setFrequency(item.value)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid max-w-xs gap-1.5">
              <label htmlFor="language" className={ui.label}>
                Idioma
              </label>
              <select
                id="language"
                name="language"
                className={ui.input}
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {LANGUAGES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                id="save-preferences"
                type="submit"
                className={`${ui.button} ${ui.primary}`}
                disabled={!dirty}
              >
                Salvar
              </button>
            </div>
          </fieldset>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
          <button
            id="lock-form"
            type="button"
            aria-pressed={locked}
            className={`${ui.button} ${ui.outline}`}
            onClick={() => setLocked(!locked)}
          >
            {locked ? (
              <LockOpen className="size-4" aria-hidden="true" />
            ) : (
              <Lock className="size-4" aria-hidden="true" />
            )}
            {locked ? "Desbloquear formulário" : "Bloquear formulário"}
          </button>
          <span id="lock-status" className="text-sm text-muted-foreground">
            {locked ? "Formulário bloqueado" : "Formulário liberado"}
          </span>
        </div>

        <Result id="preferences-result" className="mt-3">
          {message}
        </Result>
      </Panel>

      <Panel title="Abas" description="A aba ativa tem aria-selected=&quot;true&quot;.">
        <div
          role="tablist"
          aria-label="Configurações"
          className="flex gap-1 border-b"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls="tab-panel"
              tabIndex={tab === item.id ? 0 : -1}
              className="-mb-px cursor-pointer border-b-2 border-transparent px-3 py-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-selected:border-primary aria-selected:font-medium aria-selected:text-foreground"
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          id="tab-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.id}`}
          data-tab={activeTab.id}
          className="pt-3 text-sm"
        >
          {activeTab.text}
        </div>
      </Panel>
    </div>
  );
}
