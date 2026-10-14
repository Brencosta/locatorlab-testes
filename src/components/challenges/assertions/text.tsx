"use client";

import { useState } from "react";
import { Panel, ui } from "@/components/challenges/ui";

const BIO_MAX = 80;
const BASE_FOLLOWERS = 128;

// Desafio 1 de assertions: texto exato, texto parcial e valor de campo.
export function TextChallenge() {
  const [following, setFollowing] = useState(false);
  const [username, setUsername] = useState("maria.souza");
  const [bio, setBio] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Texto exato" description="Compare o texto inteiro.">
        <div className="grid gap-3">
          <h4 id="welcome-title" className="text-lg font-semibold">
            Bem-vindo, Maria Souza!
          </h4>

          {/* Os espaços e a quebra de linha a mais são propositais: existem
              no HTML, mas o navegador mostra o texto normalizado. */}
          <p id="order-status" className="text-sm">
            {"   Pedido    nº 4821\n      confirmado   "}
          </p>

          {/* O texto no HTML tem só a inicial maiúscula; o CSS transforma. */}
          <div>
            <span
              id="promo-badge"
              className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-primary uppercase"
            >
              Promoção relâmpago
            </span>
          </div>

          <p id="product-price" className="text-2xl font-semibold tabular-nums">
            R$ 1.299,90
          </p>
        </div>
      </Panel>

      <Panel title="Texto parcial" description="Valide só um trecho.">
        <div className="grid gap-3 text-sm">
          <p id="terms-text" className="leading-relaxed">
            Ao concluir a compra você concorda com os termos de uso. O prazo de
            entrega é de 3 dias úteis para capitais e de 7 dias úteis para as
            demais cidades. Trocas podem ser feitas em até 30 dias.
          </p>
          <p id="cart-summary" className="rounded-lg bg-muted/50 px-3 py-2">
            Você tem <strong id="cart-quantity">3 itens</strong> no carrinho,
            no valor de <strong id="cart-value">R$ 379,70</strong>.
          </p>
        </div>
      </Panel>

      <Panel
        title="Valor e texto que muda"
        description="Valor de campo não é texto do elemento."
      >
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="username-input" className={ui.label}>
              Usuário
            </label>
            <input
              id="username-input"
              name="username"
              type="text"
              autoComplete="off"
              placeholder="Digite seu usuário"
              className={ui.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              id="follow-button"
              type="button"
              aria-pressed={following}
              className={`${ui.button} ${following ? ui.outline : ui.primary}`}
              onClick={() => setFollowing(!following)}
            >
              {following ? "Seguindo" : "Seguir"}
            </button>
            <span id="followers-count" className="text-sm text-muted-foreground">
              {BASE_FOLLOWERS + (following ? 1 : 0)} seguidores
            </span>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="bio-input" className={ui.label}>
              Bio
            </label>
            <textarea
              id="bio-input"
              name="bio"
              rows={2}
              maxLength={BIO_MAX}
              className={`${ui.input} h-auto py-2`}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
            <p id="bio-counter" className={ui.hint} aria-live="polite">
              {bio.length}/{BIO_MAX} caracteres
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
