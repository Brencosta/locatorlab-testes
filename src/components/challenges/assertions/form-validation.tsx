"use client";

import { useState } from "react";
import { Panel, Result, ui } from "@/components/challenges/ui";

type Values = {
  name: string;
  email: string;
  age: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const INITIAL: Values = {
  name: "",
  email: "",
  age: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Uma mensagem por campo: a primeira regra que falhar.
function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const age = values.age.trim();

  if (name === "") errors.name = "Informe o nome.";
  else if (name.length < 3) errors.name = "O nome deve ter pelo menos 3 caracteres.";

  if (email === "") errors.email = "Informe o e-mail.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "E-mail inválido.";

  if (age === "") errors.age = "Informe a idade.";
  else if (!/^\d+$/.test(age)) errors.age = "A idade deve ser um número inteiro.";
  else if (Number(age) < 18) errors.age = "Você deve ter pelo menos 18 anos.";
  else if (Number(age) > 120) errors.age = "Idade inválida.";

  if (values.password === "") errors.password = "Informe a senha.";
  else if (values.password.length < 8)
    errors.password = "A senha deve ter pelo menos 8 caracteres.";
  else if (!/\d/.test(values.password))
    errors.password = "A senha deve conter pelo menos um número.";

  if (values.confirmPassword === "") errors.confirmPassword = "Confirme a senha.";
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "As senhas não coincidem.";

  if (!values.terms) errors.terms = "Você precisa aceitar os termos.";

  return errors;
}

const TEXT_FIELDS: Array<{
  field: Exclude<Field, "terms">;
  id: string;
  label: string;
  type: string;
  hint?: string;
}> = [
  { field: "name", id: "name", label: "Nome", type: "text" },
  { field: "email", id: "email", label: "E-mail", type: "email" },
  { field: "age", id: "age", label: "Idade", type: "text", hint: "Entre 18 e 120 anos." },
  {
    field: "password",
    id: "password",
    label: "Senha",
    type: "password",
    hint: "Mínimo de 8 caracteres, com pelo menos um número.",
  },
  {
    field: "confirmPassword",
    id: "confirm-password",
    label: "Confirmar senha",
    type: "password",
  },
];

// Desafio 8 de assertions: a validação começa no primeiro envio e, a partir
// daí, acompanha a digitação.
export function FormValidationChallenge() {
  const [values, setValues] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const errors = submitted ? validate(values) : {};
  const errorCount = Object.keys(errors).length;

  function update<K extends Field>(field: K, value: Values[K]) {
    setValues({ ...values, [field]: value });
    setSuccess(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(validate(values)).length === 0) {
      setSuccess(values.name.trim());
    } else {
      setSuccess(null);
    }
  }

  return (
    <Panel title="Cadastro" description="Envie vazio para ver todas as mensagens.">
      <form
        id="signup-form"
        className="grid max-w-xl gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        {submitted && errorCount > 0 ? (
          <p
            id="form-summary"
            role="alert"
            data-error-count={errorCount}
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errorCount === 1
              ? "Corrija 1 campo para continuar."
              : `Corrija ${errorCount} campos para continuar.`}
          </p>
        ) : null}

        {TEXT_FIELDS.map(({ field, id, label, type, hint }) => {
          const error = errors[field];
          return (
            <div key={field} className="form-field grid gap-1.5" data-field={id}>
              <label htmlFor={id} className={ui.label}>
                {label}
              </label>
              <input
                id={id}
                name={field}
                type={type}
                autoComplete="off"
                inputMode={field === "age" ? "numeric" : undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                className={`${ui.input} aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`}
                value={values[field]}
                onChange={(event) => update(field, event.target.value)}
              />
              {error ? (
                <p id={`${id}-error`} role="alert" className="field-error text-sm text-destructive">
                  {error}
                </p>
              ) : hint ? (
                <p id={`${id}-hint`} className={ui.hint}>
                  {hint}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="form-field grid gap-1.5" data-field="terms">
          <label htmlFor="terms" className="flex items-center gap-2 text-sm">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className={ui.check}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? "terms-error" : undefined}
              checked={values.terms}
              onChange={(event) => update("terms", event.target.checked)}
            />
            Li e aceito os termos de uso
          </label>
          {errors.terms ? (
            <p id="terms-error" role="alert" className="field-error text-sm text-destructive">
              {errors.terms}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button id="submit-signup" type="submit" className={`${ui.button} ${ui.primary}`}>
            Cadastrar
          </button>
          <button
            id="reset-signup"
            type="button"
            className={`${ui.button} ${ui.outline}`}
            onClick={() => {
              setValues(INITIAL);
              setSubmitted(false);
              setSuccess(null);
            }}
          >
            Limpar
          </button>
        </div>

        {success ? (
          <Result id="form-success" className="text-success">
            Cadastro enviado com sucesso, {success}!
          </Result>
        ) : null}
      </form>
    </Panel>
  );
}
