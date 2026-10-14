"use client";

import { useState } from "react";
import { Panel, Result, ui } from "@/components/challenges/ui";

// Desafio 2: de propósito, NENHUM elemento aqui tem id, name, data-testid ou
// aria-label. Os botões de todas as linhas são idênticos.

const USERS = [
  { name: "Ana Lima", email: "ana.lima@empresa.com", role: "Admin" },
  { name: "Maria Souza", email: "maria.souza@empresa.com", role: "Editor" },
  { name: "João Pedro", email: "joao.pedro@empresa.com", role: "Leitor" },
  { name: "Mariana Souza", email: "mariana.souza@empresa.com", role: "Editor" },
  { name: "Carlos Maria", email: "carlos.maria@empresa.com", role: "Leitor" },
];

const PLANS = [
  { name: "Básico", price: "R$ 19/mês", detail: "1 projeto e 3 usuários" },
  { name: "Pro", price: "R$ 49/mês", detail: "10 projetos e 20 usuários" },
  { name: "Empresa", price: "R$ 149/mês", detail: "Projetos e usuários ilimitados" },
];

export function RelativeLocatorsChallenge() {
  const [users, setUsers] = useState(USERS);
  const [userMessage, setUserMessage] = useState("Nenhuma ação realizada.");
  const [planMessage, setPlanMessage] = useState("Nenhum plano assinado.");

  return (
    <div className="grid gap-4">
      <Panel title="Usuários" description="Botões iguais em todas as linhas.">
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Nome</th>
                <th className={ui.th}>E-mail</th>
                <th className={ui.th}>Papel</th>
                <th className={ui.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td className={ui.td}>{user.name}</td>
                  <td className={ui.td}>{user.email}</td>
                  <td className={ui.td}>{user.role}</td>
                  <td className={ui.td}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`${ui.button} ${ui.outline}`}
                        onClick={() => setUserMessage(`Editando: ${user.name}`)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${ui.button} ${ui.outline}`}
                        onClick={() => {
                          setUsers(users.filter((item) => item !== user));
                          setUserMessage(`Excluído: ${user.name}`);
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Result className="mt-3">{userMessage}</Result>
      </Panel>

      <Panel title="Planos" description="Cartões com a mesma estrutura.">
        <div className="grid gap-3 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <article key={plan.name} className="rounded-lg border p-3">
              <h4 className="font-semibold">{plan.name}</h4>
              <p className="text-lg font-semibold">{plan.price}</p>
              <p className="mb-3 text-xs text-muted-foreground">{plan.detail}</p>
              <button
                type="button"
                className={`${ui.button} ${ui.primary} w-full`}
                onClick={() =>
                  setPlanMessage(`Plano assinado: ${plan.name} (${plan.price})`)
                }
              >
                Assinar
              </button>
            </article>
          ))}
        </div>
        <Result className="mt-3">{planMessage}</Result>
      </Panel>
    </div>
  );
}
