"use client";

import { useState } from "react";
import { Panel, Result, ui } from "@/components/challenges/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Desafio 14: um modal de HTML e os três diálogos nativos do navegador.
export function DialogsChallenge() {
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [modalMessage, setModalMessage] = useState("Nenhum projeto criado.");
  const [nativeMessage, setNativeMessage] = useState(
    "Nenhum diálogo nativo aberto.",
  );

  function handleModalChange(open: boolean) {
    setModalOpen(open);
    if (!open) setProjectName("");
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectName.trim()) return;
    setModalMessage(`Projeto criado: ${projectName.trim()}`);
    handleModalChange(false);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="Modal (HTML)"
        description="Faz parte da página: é localizado como qualquer elemento."
      >
        <button
          id="open-modal"
          type="button"
          className={`${ui.button} ${ui.primary}`}
          onClick={() => setModalOpen(true)}
        >
          Abrir modal
        </button>
        <Result id="modal-result" className="mt-3">
          {modalMessage}
        </Result>

        <Dialog open={modalOpen} onOpenChange={handleModalChange}>
          <DialogContent id="project-modal">
            <DialogHeader>
              <DialogTitle id="project-modal-title">Novo projeto</DialogTitle>
              <DialogDescription>
                Informe o nome do projeto e confirme.
              </DialogDescription>
            </DialogHeader>
            <form
              id="project-form"
              className="grid gap-4"
              onSubmit={handleCreate}
              noValidate
            >
              <div className="grid gap-1.5">
                <label htmlFor="project-name" className={ui.label}>
                  Nome do projeto
                </label>
                <input
                  id="project-name"
                  name="projectName"
                  type="text"
                  autoComplete="off"
                  className={ui.input}
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                />
              </div>
              <DialogFooter>
                <button
                  id="modal-cancel"
                  type="button"
                  className={`${ui.button} ${ui.outline}`}
                  onClick={() => {
                    setModalMessage("Criação de projeto cancelada.");
                    handleModalChange(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  id="modal-confirm"
                  type="submit"
                  className={`${ui.button} ${ui.primary}`}
                  disabled={!projectName.trim()}
                >
                  Criar projeto
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Panel>

      <Panel
        title="Diálogos nativos"
        description="São janelas do navegador: não têm HTML para inspecionar."
      >
        <div className="flex flex-wrap gap-2">
          <button
            id="alert-button"
            type="button"
            className={`${ui.button} ${ui.outline}`}
            onClick={() => {
              window.alert("Operação concluída com sucesso!");
              setNativeMessage("Alert fechado.");
            }}
          >
            Mostrar alert
          </button>
          <button
            id="confirm-button"
            type="button"
            className={`${ui.button} ${ui.outline}`}
            onClick={() => {
              const accepted = window.confirm("Deseja excluir o registro?");
              setNativeMessage(
                accepted
                  ? "Confirm aceito: registro excluído."
                  : "Confirm cancelado: nada foi excluído.",
              );
            }}
          >
            Mostrar confirm
          </button>
          <button
            id="prompt-button"
            type="button"
            className={`${ui.button} ${ui.outline}`}
            onClick={() => {
              const answer = window.prompt("Qual é o seu nome?", "");
              if (answer === null) {
                setNativeMessage("Prompt cancelado.");
              } else if (answer.trim() === "") {
                setNativeMessage("Prompt enviado sem nome.");
              } else {
                setNativeMessage(`Olá, ${answer.trim()}!`);
              }
            }}
          >
            Mostrar prompt
          </button>
        </div>
        <Result id="native-result" className="mt-3">
          {nativeMessage}
        </Result>
      </Panel>
    </div>
  );
}
