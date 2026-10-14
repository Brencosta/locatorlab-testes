"use client";

import { useState } from "react";
import { Result, ui } from "@/components/challenges/ui";

const COUNTRIES = [
  { value: "br", label: "Brasil" },
  { value: "pt", label: "Portugal" },
  { value: "ao", label: "Angola" },
  { value: "mz", label: "Moçambique" },
];

const INITIAL = { username: "", email: "", country: "", newsletter: false };

// Desafio 1: todo elemento tem id, name e uma classe legível.
export function BasicAttributesChallenge() {
  const [form, setForm] = useState(INITIAL);
  const [message, setMessage] = useState("Nenhum cadastro salvo ainda.");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.username.trim() || !form.email.trim()) {
      setMessage("Preencha usuário e e-mail para salvar.");
      return;
    }
    const country =
      COUNTRIES.find((item) => item.value === form.country)?.label ??
      "país não informado";
    setMessage(
      `Cadastro salvo: ${form.username.trim()} (${form.email.trim()}), ${country}, newsletter: ${
        form.newsletter ? "sim" : "não"
      }.`,
    );
  }

  function handleClear() {
    setForm(INITIAL);
    setMessage("Formulário limpo.");
  }

  return (
    <form
      id="signup-form"
      name="signup"
      className="signup-form grid max-w-xl gap-4"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-group grid gap-1.5">
        <label htmlFor="username" className={`form-label ${ui.label}`}>
          Usuário
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          className={`form-input ${ui.input}`}
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
        />
      </div>

      <div className="form-group grid gap-1.5">
        <label htmlFor="email" className={`form-label ${ui.label}`}>
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          className={`form-input ${ui.input}`}
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
      </div>

      <div className="form-group grid gap-1.5">
        <label htmlFor="country" className={`form-label ${ui.label}`}>
          País
        </label>
        <select
          id="country"
          name="country"
          className={`form-select ${ui.input}`}
          value={form.country}
          onChange={(event) => setForm({ ...form, country: event.target.value })}
        >
          <option value="">Selecione</option>
          {COUNTRIES.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      <label
        htmlFor="newsletter"
        className="form-check-label flex items-center gap-2 text-sm"
      >
        <input
          id="newsletter"
          name="newsletter"
          type="checkbox"
          className={`form-check ${ui.check}`}
          checked={form.newsletter}
          onChange={(event) =>
            setForm({ ...form, newsletter: event.target.checked })
          }
        />
        Quero receber a newsletter
      </label>

      <div className="form-actions flex flex-wrap items-center gap-2">
        <button
          id="btn-save"
          name="save"
          type="submit"
          className={`btn btn-primary ${ui.button} ${ui.primary}`}
        >
          Salvar
        </button>
        <button
          id="btn-clear"
          name="clear"
          type="button"
          className={`btn btn-secondary ${ui.button} ${ui.outline}`}
          onClick={handleClear}
        >
          Limpar
        </button>
        <a
          id="help-link"
          className="help-link text-sm text-primary underline-offset-4 hover:underline"
          href="#result-message"
        >
          Onde vejo o resultado?
        </a>
      </div>

      <Result id="result-message" className="result-message">
        {message}
      </Result>
    </form>
  );
}
