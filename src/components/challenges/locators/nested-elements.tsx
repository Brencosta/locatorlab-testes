"use client";

import { useState } from "react";
import { Result, ui } from "@/components/challenges/ui";

// Desafio 7: árvore Departamento > Equipe > Projeto > Tarefa com várias divs
// intermediárias. De propósito, sem id, name ou data-testid. Tarefas e
// projetos com o mesmo nome aparecem em ramos diferentes.
//
// As classes "department", "team", "project" e "task" marcam só o elemento de
// cada nível. As divs auxiliares usam nomes neutros (node-*, item-*) para que
// contains(@class, "team") não case com elas por engano.

const ORGANIZATION = [
  {
    name: "Engenharia",
    teams: [
      {
        name: "Backend",
        projects: [
          { name: "Portal", tasks: ["Revisar contrato", "Publicar versão"] },
          { name: "API", tasks: ["Revisar contrato", "Atualizar documentação"] },
        ],
      },
      {
        name: "Frontend",
        projects: [
          { name: "Portal", tasks: ["Publicar versão", "Corrigir layout"] },
        ],
      },
    ],
  },
  {
    name: "Marketing",
    teams: [
      {
        name: "Conteúdo",
        projects: [
          { name: "Portal", tasks: ["Revisar contrato", "Escrever artigo"] },
          { name: "Campanha de lançamento", tasks: ["Aprovar orçamento"] },
        ],
      },
    ],
  },
];

export function NestedElementsChallenge() {
  const [approved, setApproved] = useState<string[]>([]);
  const [message, setMessage] = useState("Nenhuma tarefa aprovada.");

  function approve(path: string) {
    setApproved([...approved, path]);
    setMessage(`Aprovada: ${path}`);
  }

  return (
    <div className="grid gap-4">
      <div className="organization grid gap-4">
        {ORGANIZATION.map((department) => (
          <section
            key={department.name}
            className="department rounded-xl border p-3"
          >
            <div className="node-header">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{department.name}</h4>
                <span className="text-xs text-muted-foreground">Departamento</span>
              </div>
            </div>
            <div className="node-body mt-3">
              <div className="node-children grid gap-3 lg:grid-cols-2">
                {department.teams.map((team) => (
                  <div key={team.name} className="team rounded-lg border p-3">
                    <div className="node-header">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-semibold">{team.name}</h5>
                        <span className="text-xs text-muted-foreground">
                          Equipe
                        </span>
                      </div>
                    </div>
                    <div className="node-body mt-2">
                      <div className="node-children grid gap-2">
                        {team.projects.map((project) => (
                          <div
                            key={project.name}
                            className="project rounded-lg bg-muted/40 p-2"
                          >
                            <div className="node-header">
                              <h6 className="text-sm font-medium">
                                {project.name}
                              </h6>
                            </div>
                            <div className="node-body">
                              <div className="node-children">
                                <ul className="item-list mt-1 grid gap-1">
                                  {project.tasks.map((task) => {
                                    const path = `${department.name} › ${team.name} › ${project.name} › ${task}`;
                                    const done = approved.includes(path);

                                    return (
                                      <li
                                        key={task}
                                        className="task flex items-center justify-between gap-2 rounded-md bg-background px-2 py-1.5"
                                      >
                                        <div className="item-info min-w-0">
                                          <div className="item-text">
                                            <span className="task-name text-sm">
                                              {task}
                                            </span>
                                          </div>
                                          <div className="item-meta">
                                            <span className="task-status text-xs text-muted-foreground">
                                              {done ? "Aprovada" : "Aguardando"}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="item-actions">
                                          <div className="action-group">
                                            <button
                                              type="button"
                                              className={`${ui.button} ${ui.outline} h-7 px-2 text-xs`}
                                              disabled={done}
                                              onClick={() => approve(path)}
                                            >
                                              Aprovar
                                            </button>
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <Result>{message}</Result>
    </div>
  );
}
