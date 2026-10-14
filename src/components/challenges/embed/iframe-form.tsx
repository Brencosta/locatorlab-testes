"use client";

import { useState } from "react";
import { Result, ui } from "@/components/challenges/ui";

const COURSES = [
  { value: "selenium", label: "Selenium WebDriver" },
  { value: "cypress", label: "Cypress" },
  { value: "playwright", label: "Playwright" },
];

/** Conteúdo exibido dentro do iframe do desafio 8. */
export function IframeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const courseLabel = COURSES.find((item) => item.value === course)?.label;

    if (!name.trim() || !email.trim() || !courseLabel) {
      setResult({ ok: false, text: "Preencha nome, e-mail e curso." });
      return;
    }
    setResult({
      ok: true,
      text: `Inscrição enviada! ${name.trim()} (${email.trim()}) no curso ${courseLabel}.`,
    });
  }

  return (
    <form
      id="signup-form"
      className="grid max-w-md gap-4"
      onSubmit={handleSubmit}
      noValidate
    >
      <h1 className="text-base font-semibold">Inscrição no curso</h1>

      <div className="grid gap-1.5">
        <label htmlFor="name" className={ui.label}>
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          className={ui.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="email" className={ui.label}>
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          className={ui.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="course" className={ui.label}>
          Curso
        </label>
        <select
          id="course"
          name="course"
          className={ui.input}
          value={course}
          onChange={(event) => setCourse(event.target.value)}
        >
          <option value="">Selecione</option>
          {COURSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          id="signup-submit"
          type="submit"
          className={`${ui.button} ${ui.primary}`}
        >
          Enviar inscrição
        </button>
      </div>

      {result ? (
        <Result
          id={result.ok ? "success-message" : "error-message"}
          role={result.ok ? "status" : "alert"}
          className={result.ok ? "text-success" : "text-destructive"}
        >
          {result.text}
        </Result>
      ) : null}
    </form>
  );
}
