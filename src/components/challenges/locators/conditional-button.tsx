"use client";

import { useState } from "react";
import { Check, Circle } from "lucide-react";
import { useBug } from "@/components/bugs/bug-context";
import { Panel, Result, ui } from "@/components/challenges/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONFIRM_WORD = "CONFIRMAR";

// Desafio 11: botões que só habilitam quando o formulário é válido.
export function ConditionalButtonChallenge() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [created, setCreated] = useState<string | null>(null);

  const [confirmText, setConfirmText] = useState("");
  const [dangerMessage, setDangerMessage] = useState("Nenhuma ação executada.");

  const requirements = [
    { key: "name", label: "Nome com pelo menos 3 letras", valid: name.trim().length >= 3 },
    { key: "email", label: "E-mail válido", valid: EMAIL_PATTERN.test(email.trim()) },
    { key: "password", label: "Senha com pelo menos 6 caracteres", valid: password.length >= 6 },
    { key: "terms", label: "Termos aceitos", valid: terms },
  ];
  const formValid = requirements.every((item) => item.valid);
  // Modo Bug: o botão fica habilitado e o envio não confere a validação.
  const skipValidation = useBug("button-always-enabled");
  const canSubmit = formValid || skipValidation;
  const confirmValid = confirmText === CONFIRM_WORD;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) setCreated(name.trim() || "usuário sem nome");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="Criar conta"
        description="O botão usa o atributo disabled."
      >
        <form
          id="account-form"
          className="grid gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-1.5">
            <label htmlFor="account-name" className={ui.label}>
              Nome
            </label>
            <input
              id="account-name"
              name="name"
              type="text"
              autoComplete="off"
              className={ui.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="account-email" className={ui.label}>
              E-mail
            </label>
            <input
              id="account-email"
              name="email"
              type="email"
              autoComplete="off"
              className={ui.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="account-password" className={ui.label}>
              Senha
            </label>
            <input
              id="account-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={ui.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <label htmlFor="account-terms" className="flex items-center gap-2 text-sm">
            <input
              id="account-terms"
              name="terms"
              type="checkbox"
              className={ui.check}
              checked={terms}
              onChange={(event) => setTerms(event.target.checked)}
            />
            Li e aceito os termos de uso
          </label>

          <ul id="requirements" className="grid gap-1 text-sm">
            {requirements.map((item) => (
              <li
                key={item.key}
                data-requirement={item.key}
                data-valid={item.valid}
                className={`flex items-center gap-2 ${
                  item.valid ? "text-success" : "text-muted-foreground"
                }`}
              >
                {item.valid ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Circle className="size-4" aria-hidden="true" />
                )}
                {item.label}
              </li>
            ))}
          </ul>

          <div>
            <button
              id="create-account"
              type="submit"
              className={`${ui.button} ${ui.primary}`}
              disabled={!canSubmit}
            >
              Criar conta
            </button>
          </div>

          {created ? (
            <Result id="account-result" className="text-success">
              Conta criada com sucesso para {created}!
            </Result>
          ) : null}
        </form>
      </Panel>

      <Panel
        title="Ação perigosa"
        description="Este botão nunca recebe disabled: ele usa aria-disabled."
      >
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="danger-confirmation" className={ui.label}>
              Digite {CONFIRM_WORD} para liberar o botão
            </label>
            <input
              id="danger-confirmation"
              name="confirmation"
              type="text"
              autoComplete="off"
              className={ui.input}
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
            />
          </div>
          <div>
            <button
              id="danger-continue"
              type="button"
              aria-disabled={!confirmValid}
              className={`${ui.button} ${ui.danger} aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
              onClick={() =>
                setDangerMessage(
                  confirmValid
                    ? "Ação executada com sucesso."
                    : "Botão bloqueado: digite CONFIRMAR primeiro.",
                )
              }
            >
              Continuar
            </button>
          </div>
          <Result id="danger-result">{dangerMessage}</Result>
        </div>
      </Panel>
    </div>
  );
}
