"use client";

import { useState } from "react";
import { Panel, Result, ui } from "@/components/challenges/ui";

// Desafio 3: os ids contêm um trecho que muda a cada carregamento (nonce).
// De propósito, não há data-testid nem name para servir de atalho.
export function DynamicIdsChallenge({ nonce }: { nonce: string }) {
  const [user, setUser] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Aguardando confirmação.");
  const [option, setOption] = useState("Nenhuma opção escolhida.");

  // Parte estável + parte dinâmica.
  const userId = `user_${nonce}`;
  const codeId = `${nonce}_code`;
  const confirmId = `btn_${nonce}_confirm`;
  const messageId = `msg_${nonce}`;

  // Ids sem nenhuma parte estável.
  const reversed = nonce.split("").reverse().join("");
  const options = ["A", "B", "C"].map((letter, index) => ({
    label: `Opção ${letter}`,
    id: `x${reversed}${(index * 7 + 3).toString(16)}${nonce.slice(index, index + 2)}`,
  }));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      user.trim() && code.trim()
        ? `Confirmado: ${user.trim()} com o código ${code.trim()}.`
        : "Preencha usuário e código.",
    );
  }

  return (
    <div className="grid gap-4">
      <Panel
        title="Ids com uma parte estável"
        description="O começo ou o fim do id é sempre o mesmo; o resto muda."
      >
        <form className="grid max-w-xl gap-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-1.5">
            <label htmlFor={userId} className={ui.label}>
              Usuário
            </label>
            <input
              id={userId}
              type="text"
              autoComplete="off"
              className={ui.input}
              value={user}
              onChange={(event) => setUser(event.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={codeId} className={ui.label}>
              Código
            </label>
            <input
              id={codeId}
              type="text"
              autoComplete="off"
              className={ui.input}
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>
          <div>
            <button
              id={confirmId}
              type="submit"
              className={`${ui.button} ${ui.primary}`}
            >
              Confirmar
            </button>
          </div>
          <Result id={messageId}>{message}</Result>
        </form>
      </Panel>

      <Panel
        title="Ids totalmente aleatórios"
        description="Nenhuma parte do id se repete entre um carregamento e outro."
      >
        <div className="flex flex-wrap gap-2">
          {options.map((item) => (
            <button
              key={item.label}
              id={item.id}
              type="button"
              className={`${ui.button} ${ui.outline}`}
              onClick={() => setOption(`Você escolheu a ${item.label}.`)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Result className="mt-3">{option}</Result>
      </Panel>

      <Panel
        title="Ids neste carregamento"
        description="Recarregue a página ou reinicie o desafio e veja os valores mudarem."
      >
        <dl className="grid gap-1 font-mono text-xs sm:grid-cols-[auto_1fr] sm:gap-x-4">
          <dt className="text-muted-foreground">Usuário</dt>
          <dd>{userId}</dd>
          <dt className="text-muted-foreground">Código</dt>
          <dd>{codeId}</dd>
          <dt className="text-muted-foreground">Confirmar</dt>
          <dd>{confirmId}</dd>
          <dt className="text-muted-foreground">Mensagem</dt>
          <dd>{messageId}</dd>
          {options.map((item) => (
            <div key={item.label} className="contents">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd>{item.id}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}
