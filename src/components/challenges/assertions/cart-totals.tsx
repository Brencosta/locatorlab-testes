"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useBug } from "@/components/bugs/bug-context";
import { formatBRL } from "@/components/challenges/format";
import { Panel, ui } from "@/components/challenges/ui";

// Tudo em centavos, para não haver erro de arredondamento.
const PRODUCTS = [
  { id: "keyboard", name: "Teclado mecânico", price: 24990 },
  { id: "mouse", name: "Mouse sem fio", price: 8990 },
  { id: "mousepad", name: "Mousepad grande", price: 3990 },
];

const SHIPPING = 2000;
const FREE_SHIPPING_FROM = 50000;
const MAX_QUANTITY = 10;

const COUPONS: Record<
  string,
  { kind: "percent"; value: number } | { kind: "free-shipping" }
> = {
  QA10: { kind: "percent", value: 10 },
  FRETEGRATIS: { kind: "free-shipping" },
};

const INITIAL_QUANTITIES: Record<string, number> = {
  keyboard: 1,
  mouse: 1,
  mousepad: 1,
};

const ICON_BUTTON = `${ui.button} ${ui.outline} h-8 w-8 px-0`;

// Desafio 7 de assertions: carrinho com subtotal, cupom, frete e total.
export function CartTotalsChallenge() {
  const [quantities, setQuantities] = useState(INITIAL_QUANTITIES);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const items = PRODUCTS.filter((product) => quantities[product.id] > 0);
  const count = items.reduce((sum, item) => sum + quantities[item.id], 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * quantities[item.id],
    0,
  );

  const rule = coupon ? COUPONS[coupon] : undefined;
  const discount =
    rule?.kind === "percent" ? Math.round((subtotal * rule.value) / 100) : 0;
  const freeShipping =
    subtotal === 0 ||
    subtotal >= FREE_SHIPPING_FROM ||
    rule?.kind === "free-shipping";
  const shipping = freeShipping ? 0 : SHIPPING;
  // Modo Bug: o total deixa de somar o frete.
  const wrongTotal = useBug("cart-total");
  const total = wrongTotal ? subtotal - discount : subtotal - discount + shipping;

  function setQuantity(id: string, quantity: number) {
    setQuantities({
      ...quantities,
      [id]: Math.max(0, Math.min(MAX_QUANTITY, quantity)),
    });
  }

  function applyCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === "") {
      setCouponMessage({ ok: false, text: "Digite um cupom." });
    } else if (!(code in COUPONS)) {
      setCouponMessage({ ok: false, text: `Cupom inválido: ${code}.` });
    } else {
      setCoupon(code);
      setCouponInput("");
      setCouponMessage({ ok: true, text: `Cupom ${code} aplicado.` });
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <Panel title="Carrinho" id="cart">
        {items.length === 0 ? (
          <p id="empty-cart" role="status" className="py-6 text-center text-sm text-muted-foreground">
            Seu carrinho está vazio.
          </p>
        ) : (
          <div className={ui.tableWrap}>
            <table id="cart-table" className={ui.table}>
              <thead>
                <tr>
                  <th scope="col" className={ui.th}>Produto</th>
                  <th scope="col" className={ui.th}>Preço</th>
                  <th scope="col" className={ui.th}>Quantidade</th>
                  <th scope="col" className={ui.th}>Subtotal</th>
                  <th scope="col" className={ui.th}>
                    <span className="sr-only">Remover</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const quantity = quantities[item.id];
                  return (
                    <tr key={item.id} id={`cart-item-${item.id}`} className="cart-item">
                      <td className={`${ui.td} item-name font-medium whitespace-nowrap`}>
                        {item.name}
                      </td>
                      <td
                        className={`${ui.td} item-price whitespace-nowrap tabular-nums`}
                        data-cents={item.price}
                      >
                        {formatBRL(item.price)}
                      </td>
                      <td className={ui.td}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${item.name}`}
                            className={ICON_BUTTON}
                            disabled={quantity <= 1}
                            onClick={() => setQuantity(item.id, quantity - 1)}
                          >
                            <Minus className="size-4" aria-hidden="true" />
                          </button>
                          <span
                            className="item-quantity w-6 text-center tabular-nums"
                            aria-label={`Quantidade de ${item.name}`}
                          >
                            {quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            className={ICON_BUTTON}
                            disabled={quantity >= MAX_QUANTITY}
                            onClick={() => setQuantity(item.id, quantity + 1)}
                          >
                            <Plus className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                      <td
                        className={`${ui.td} item-subtotal font-medium whitespace-nowrap tabular-nums`}
                        data-cents={item.price * quantity}
                      >
                        {formatBRL(item.price * quantity)}
                      </td>
                      <td className={ui.td}>
                        <button
                          type="button"
                          aria-label={`Remover ${item.name}`}
                          className={`${ICON_BUTTON} text-destructive`}
                          onClick={() => setQuantity(item.id, 0)}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className={`${ui.hint} mt-3`}>
          Frete de {formatBRL(SHIPPING)}, grátis a partir de{" "}
          {formatBRL(FREE_SHIPPING_FROM)} em produtos.
        </p>
      </Panel>

      <Panel title="Resumo" id="cart-summary">
        <form id="coupon-form" className="grid gap-2" onSubmit={applyCoupon} noValidate>
          <label htmlFor="coupon-input" className={ui.label}>
            Cupom de desconto
          </label>
          <div className="flex gap-2">
            <input
              id="coupon-input"
              name="coupon"
              type="text"
              autoComplete="off"
              placeholder="Ex.: QA10"
              className={ui.input}
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
            />
            <button id="apply-coupon" type="submit" className={`${ui.button} ${ui.outline}`}>
              Aplicar
            </button>
          </div>
          {couponMessage ? (
            <p
              id="coupon-message"
              role={couponMessage.ok ? "status" : "alert"}
              data-valid={couponMessage.ok}
              className={`text-sm ${
                couponMessage.ok ? "text-success" : "text-destructive"
              }`}
            >
              {couponMessage.text}
            </p>
          ) : null}
          {coupon ? (
            <p className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-2 py-1 text-sm">
              <span>
                Cupom ativo: <strong id="active-coupon">{coupon}</strong>
              </span>
              <button
                id="remove-coupon"
                type="button"
                className="cursor-pointer rounded text-xs text-muted-foreground underline underline-offset-2 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={() => {
                  setCoupon(null);
                  setCouponMessage({ ok: true, text: "Cupom removido." });
                }}
              >
                Remover
              </button>
            </p>
          ) : null}
        </form>

        <dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-1.5 border-t pt-4 text-sm">
          <dt className="text-muted-foreground">Itens</dt>
          <dd id="cart-count" className="text-right tabular-nums" data-count={count}>
            {count} {count === 1 ? "item" : "itens"}
          </dd>

          <dt className="text-muted-foreground">Subtotal</dt>
          <dd id="cart-subtotal" className="text-right tabular-nums" data-cents={subtotal}>
            {formatBRL(subtotal)}
          </dd>

          <dt className="text-muted-foreground">Desconto</dt>
          <dd id="cart-discount" className="text-right tabular-nums" data-cents={discount}>
            {discount > 0 ? `- ${formatBRL(discount)}` : formatBRL(0)}
          </dd>

          <dt className="text-muted-foreground">Frete</dt>
          <dd
            id="cart-shipping"
            className="text-right tabular-nums"
            data-cents={shipping}
            data-free={shipping === 0 && subtotal > 0}
          >
            {subtotal === 0 ? formatBRL(0) : shipping === 0 ? "Grátis" : formatBRL(shipping)}
          </dd>

          <dt className="border-t pt-2 font-semibold">Total</dt>
          <dd
            id="cart-total"
            className="border-t pt-2 text-right text-base font-semibold tabular-nums"
            data-cents={total}
          >
            {formatBRL(total)}
          </dd>
        </dl>
      </Panel>
    </div>
  );
}
