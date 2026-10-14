"use client";

import { useEffect, useRef } from "react";
import { Panel } from "@/components/challenges/ui";

const VALID_COUPON = "LOCATOR10";

// As variáveis CSS do tema atravessam o shadow root; classes do Tailwind não.
const STYLES = `
  :host { display: block; font-size: 0.875rem; }
  .box { display: grid; gap: 0.75rem; max-width: 28rem; }
  label { font-weight: 500; }
  .row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  input {
    flex: 1; min-width: 10rem; height: 2.25rem; padding: 0 0.75rem;
    border: 1px solid var(--input); border-radius: 0.5rem;
    background: transparent; color: inherit; font: inherit;
  }
  input:focus-visible, button:focus-visible {
    outline: 3px solid color-mix(in oklch, var(--ring) 50%, transparent);
  }
  button {
    height: 2.25rem; padding: 0 0.75rem; border: 0; border-radius: 0.5rem;
    background: var(--primary); color: var(--primary-foreground);
    font: inherit; font-weight: 500; cursor: pointer;
  }
  p {
    margin: 0; padding: 0.5rem 0.75rem; border: 1px dashed var(--border);
    border-radius: 0.5rem; background: color-mix(in oklch, var(--muted) 40%, transparent);
  }
`;

function buildShadowTree(host: HTMLElement) {
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>${STYLES}</style>
    <div class="box">
      <label for="shadow-input">Cupom de desconto</label>
      <div class="row">
        <input id="shadow-input" name="coupon" type="text" autocomplete="off" placeholder="Digite o cupom" />
        <button id="shadow-button" type="button">Aplicar cupom</button>
      </div>
      <p id="shadow-result" role="status">Nenhum cupom aplicado.</p>
      <div id="nested-host"></div>
    </div>
  `;

  const input = root.querySelector<HTMLInputElement>("#shadow-input")!;
  const result = root.querySelector<HTMLParagraphElement>("#shadow-result")!;

  root.querySelector("#shadow-button")!.addEventListener("click", () => {
    const coupon = input.value.trim().toUpperCase();
    if (!coupon) {
      result.textContent = "Digite um cupom.";
    } else if (coupon === VALID_COUPON) {
      result.textContent = "Cupom aplicado: 10% de desconto.";
    } else {
      result.textContent = `Cupom inválido: ${coupon}.`;
    }
  });

  // Segundo shadow root, dentro do primeiro.
  const nestedHost = root.querySelector<HTMLElement>("#nested-host")!;
  const nestedRoot = nestedHost.attachShadow({ mode: "open" });
  nestedRoot.innerHTML = `
    <style>${STYLES}</style>
    <div class="box">
      <div class="row">
        <button id="confirm-order" type="button">Confirmar pedido</button>
      </div>
      <p id="order-result" role="status">Pedido ainda não confirmado.</p>
    </div>
  `;

  const orderResult =
    nestedRoot.querySelector<HTMLParagraphElement>("#order-result")!;
  nestedRoot.querySelector("#confirm-order")!.addEventListener("click", () => {
    orderResult.textContent = "Pedido confirmado!";
  });
}

// Desafio 9: o conteúdo é montado dentro de dois shadow roots abertos.
export function ShadowDomChallenge() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    // Um elemento só pode receber um shadow root (o efeito roda duas vezes em dev).
    if (host && !host.shadowRoot) buildShadowTree(host);
  }, []);

  return (
    <Panel
      title="Carrinho"
      description="Tudo abaixo desta linha está dentro de um shadow root."
    >
      <div id="shadow-host" ref={hostRef} />
    </Panel>
  );
}
