"use client";

import { useState } from "react";
import { Panel, Result, ui } from "@/components/challenges/ui";

// Desafio 6: textos parecidos e botões idênticos. De propósito, sem id, name,
// data-testid ou aria-label nos itens.

const PRODUCTS = [
  { name: "Teclado", price: "R$ 99", available: true },
  { name: "Teclado Mecânico", price: "R$ 249", available: true },
  { name: "Teclado Mecânico RGB", price: "R$ 399", available: false },
  { name: "Mouse", price: "R$ 59", available: true },
  { name: "Mouse Gamer", price: "R$ 189", available: true },
  { name: "Mouse Pad", price: "R$ 39", available: true },
];

const ORDERS = [
  { number: "#1001", customer: "Ana", product: "Teclado Mecânico", status: "Enviado" },
  { number: "#1002", customer: "Ana", product: "Mouse", status: "Pendente" },
  { number: "#1003", customer: "Bruno", product: "Teclado", status: "Pendente" },
  { number: "#1004", customer: "Ana", product: "Teclado", status: "Pendente" },
  { number: "#1005", customer: "Bruno", product: "Teclado Mecânico", status: "Enviado" },
  { number: "#1006", customer: "Ana Paula", product: "Teclado", status: "Cancelado" },
  { number: "#1007", customer: "Bruno", product: "Mouse Gamer", status: "Pendente" },
  { number: "#1008", customer: "Ana", product: "Mouse Pad", status: "Enviado" },
];

export function RepeatedItemsChallenge() {
  const [cart, setCart] = useState<string[]>([]);
  const [orderMessage, setOrderMessage] = useState("Nenhum pedido aberto.");

  return (
    <div className="grid gap-4">
      <Panel title="Produtos" description="Nomes parecidos, botões iguais.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <li
              key={product.name}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {product.price}
                  {product.available ? "" : " · Esgotado"}
                </p>
              </div>
              <button
                type="button"
                className={`${ui.button} ${ui.outline}`}
                disabled={!product.available}
                onClick={() => setCart([...cart, product.name])}
              >
                Adicionar
              </button>
            </li>
          ))}
        </ul>
        <Result className="mt-3">
          {cart.length === 0
            ? "Carrinho vazio."
            : `Carrinho: ${cart.length} ${
                cart.length === 1 ? "item" : "itens"
              }. Último adicionado: ${cart[cart.length - 1]}.`}
        </Result>
      </Panel>

      <Panel title="Pedidos" description="Clientes e produtos se repetem.">
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Pedido</th>
                <th className={ui.th}>Cliente</th>
                <th className={ui.th}>Produto</th>
                <th className={ui.th}>Status</th>
                <th className={ui.th}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order) => (
                <tr key={order.number}>
                  <td className={ui.td}>{order.number}</td>
                  <td className={ui.td}>{order.customer}</td>
                  <td className={ui.td}>{order.product}</td>
                  <td className={ui.td}>{order.status}</td>
                  <td className={ui.td}>
                    <button
                      type="button"
                      className={`${ui.button} ${ui.outline}`}
                      onClick={() =>
                        setOrderMessage(
                          `Pedido ${order.number}: ${order.product} para ${order.customer} (${order.status}).`,
                        )
                      }
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Result className="mt-3">{orderMessage}</Result>
      </Panel>
    </div>
  );
}
