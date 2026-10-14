"use client";

import { useState } from "react";
import { Share2, Star, X } from "lucide-react";
import { Result, ui } from "@/components/challenges/ui";

// Desafio 5: de propósito, NENHUM elemento aqui tem id, name ou data-testid, e
// todos os botões usam as mesmas classes. Só texto, label, placeholder, role e
// aria-label diferenciam os elementos.

const SECTIONS = ["Visão geral", "Relatórios", "Configurações"];
const ACTION = `${ui.button} ${ui.outline}`;
const ICON_ACTION = `${ui.button} ${ui.outline} w-9 px-0`;

export function TextAndRoleChallenge() {
  const [message, setMessage] = useState("Nenhuma ação realizada.");
  const [section, setSection] = useState(SECTIONS[0]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);

  return (
    <div className="grid gap-4">
      <nav aria-label="Seções" className="flex flex-wrap gap-4 border-b pb-2 text-sm">
        {SECTIONS.map((item) => (
          <a
            key={item}
            href={`#${encodeURIComponent(item)}`}
            aria-current={section === item ? "page" : undefined}
            className="text-muted-foreground underline-offset-4 hover:underline aria-[current=page]:font-medium aria-[current=page]:text-foreground"
            onClick={(event) => {
              event.preventDefault();
              setSection(item);
              setMessage(`Seção aberta: ${item}`);
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <svg
          role="img"
          aria-label="Logotipo do documento"
          viewBox="0 0 24 24"
          className="size-6 text-primary"
          fill="currentColor"
        >
          <path d="M6 2h8l4 4v16H6z" opacity="0.25" />
          <path d="M8 10h8v2H8zm0 4h8v2H8z" />
        </svg>
        <h3 className="text-base font-semibold">
          {title.trim() || "Documento sem título"}
        </h3>
      </div>

      {alertOpen ? (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm"
        >
          <span>Você tem alterações não salvas.</span>
          <button
            type="button"
            aria-label="Fechar aviso"
            className={ICON_ACTION}
            onClick={() => {
              setAlertOpen(false);
              setMessage("Aviso fechado.");
            }}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div
        role="toolbar"
        aria-label="Ações do documento"
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          className={ACTION}
          onClick={() => setMessage("Documento salvo.")}
        >
          Salvar
        </button>
        <button
          type="button"
          className={ACTION}
          onClick={() => setMessage("Rascunho salvo.")}
        >
          Salvar rascunho
        </button>
        <button
          type="button"
          className={ACTION}
          onClick={() => setMessage("Documento salvo e publicado.")}
        >
          Salvar e publicar
        </button>
        <button
          type="button"
          aria-label="Favoritar"
          aria-pressed={favorite}
          className={`${ICON_ACTION} aria-pressed:border-warning aria-pressed:text-warning`}
          onClick={() => {
            setFavorite(!favorite);
            setMessage(
              favorite ? "Removido dos favoritos." : "Adicionado aos favoritos.",
            );
          }}
        >
          <Star
            className="size-4"
            fill={favorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          aria-label="Compartilhar"
          className={ICON_ACTION}
          onClick={() => setMessage("Link de compartilhamento copiado.")}
        >
          <Share2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid max-w-xl gap-4">
        <label className={`grid gap-1.5 ${ui.label}`}>
          Título do documento
          <input
            type="text"
            autoComplete="off"
            className={`${ui.input} font-normal`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <input
          type="search"
          placeholder="Buscar no documento"
          className={ui.input}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setMessage(
              event.target.value
                ? `Buscando por: ${event.target.value}`
                : "Busca limpa.",
            );
          }}
        />

        <textarea
          aria-label="Comentário"
          placeholder="Escreva um comentário"
          rows={2}
          className={`${ui.input} h-auto py-2`}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={ACTION}
            disabled={!comment.trim()}
            onClick={() => {
              setMessage(`Comentário enviado: ${comment.trim()}`);
              setComment("");
            }}
          >
            Enviar comentário
          </button>

          <span className="flex items-center gap-2 text-sm">
            <button
              type="button"
              role="switch"
              aria-checked={focusMode}
              aria-label="Modo foco"
              className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-input transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:bg-primary"
              onClick={() => {
                setFocusMode(!focusMode);
                setMessage(
                  focusMode ? "Modo foco desligado." : "Modo foco ligado.",
                );
              }}
            >
              <span
                aria-hidden="true"
                className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-background shadow transition-transform ${
                  focusMode ? "translate-x-4" : ""
                }`}
              />
            </button>
            <span aria-hidden="true">Modo foco</span>
          </span>
        </div>
      </div>

      <Result>{message}</Result>
    </div>
  );
}
