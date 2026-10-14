"use client";

import { useState } from "react";
import { Panel, ui } from "@/components/challenges/ui";

const PRODUCTS = [
  { sku: "mouse", name: "Mouse sem fio", price: 89 },
  { sku: "keyboard", name: "Teclado mecânico", price: 249 },
  { sku: "headset", name: "Headset com microfone", price: 179 },
];

// Desafio 4: as classes "sc-..." imitam nomes gerados por ferramenta (mudam a
// cada build); o localizador estável é o data-testid.
export function DataTestidChallenge() {
  const [cart, setCart] = useState<Record<string, number>>({});

  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = PRODUCTS.reduce(
    (sum, product) => sum + product.price * (cart[product.sku] ?? 0),
    0,
  );

  return (
    <div className="sc-9f2a1c grid gap-4 lg:grid-cols-[1fr_18rem]">
      <Panel title="Produtos" data-testid="product-list">
        <ul className="sc-41bd07 grid gap-3 sm:grid-cols-3">
          {PRODUCTS.map((product) => (
            <li
              key={product.sku}
              className="sc-e83c55 flex flex-col gap-2 rounded-lg border p-3"
              data-testid={`product-card-${product.sku}`}
            >
              <span
                className="sc-7a10fe font-medium"
                data-testid={`product-name-${product.sku}`}
              >
                {product.name}
              </span>
              <span
                className="sc-b2d9c0 text-sm text-muted-foreground"
                data-testid={`product-price-${product.sku}`}
              >
                R$ {product.price},00
              </span>
              <button
                type="button"
                className={`sc-0c6e2b ${ui.button} ${ui.primary} mt-auto`}
                data-testid={`add-to-cart-${product.sku}`}
                onClick={() =>
                  setCart({
                    ...cart,
                    [product.sku]: (cart[product.sku] ?? 0) + 1,
                  })
                }
              >
                Adicionar
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Carrinho" data-testid="cart">
        {count === 0 ? (
          <p
            className="sc-d4410a text-sm text-muted-foreground"
            data-testid="cart-empty-message"
          >
            Seu carrinho está vazio.
          </p>
        ) : (
          <ul className="sc-5be7f1 grid gap-1 text-sm" data-testid="cart-items">
            {PRODUCTS.filter((product) => cart[product.sku]).map((product) => (
              <li
                key={product.sku}
                className="sc-13aa9d flex justify-between gap-2"
                data-testid={`cart-item-${product.sku}`}
              >
                <span>{product.name}</span>
                <span data-testid={`cart-item-quantity-${product.sku}`}>
                  {cart[product.sku]}x
                </span>
              </li>
            ))}
          </ul>
        )}

        <dl className="sc-88c2e4 mt-3 grid grid-cols-2 gap-y-1 border-t pt-3 text-sm">
          <dt className="text-muted-foreground">Itens</dt>
          <dd className="text-right font-medium" data-testid="cart-count">
            {count}
          </dd>
          <dt className="text-muted-foreground">Total</dt>
          <dd className="text-right font-medium" data-testid="cart-total">
            R$ {total},00
          </dd>
        </dl>

        <button
          type="button"
          className={`sc-f09b3a ${ui.button} ${ui.outline} mt-3 w-full`}
          data-testid="clear-cart"
          disabled={count === 0}
          onClick={() => setCart({})}
        >
          Esvaziar carrinho
        </button>
      </Panel>
    </div>
  );
}
