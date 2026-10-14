"use client";

import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { Panel, Result, ui } from "@/components/challenges/ui";

const FILE_INPUT =
  "block w-full min-w-0 cursor-pointer rounded-lg border border-input text-sm text-muted-foreground outline-none file:mr-3 file:cursor-pointer file:border-0 file:border-r file:border-input file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1).replace(".", ",")} KB`;
}

// Desafio 17: nada é enviado ao servidor; a página só lê os dados do arquivo.
export function FileUploadChallenge() {
  const [single, setSingle] = useState<File | null>(null);
  const [singleMessage, setSingleMessage] = useState("Nenhum arquivo enviado.");
  const [images, setImages] = useState<File[]>([]);
  const [documentMessage, setDocumentMessage] = useState<{
    ok: boolean;
    text: string;
  }>({ ok: true, text: "Nenhum documento escolhido." });
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Input simples" description="Um arquivo, input visível.">
        <form
          id="single-upload-form"
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setSingleMessage(
              single
                ? `Upload concluído: ${single.name} (${formatSize(single.size)})`
                : "Selecione um arquivo antes de enviar.",
            );
          }}
        >
          <div className="grid gap-1.5">
            <label htmlFor="single-file" className={ui.label}>
              Arquivo
            </label>
            <input
              id="single-file"
              name="file"
              type="file"
              className={FILE_INPUT}
              onChange={(event) => setSingle(event.target.files?.[0] ?? null)}
            />
          </div>
          <p id="single-file-name" className={ui.hint}>
            {single ? `Selecionado: ${single.name}` : "Nenhum arquivo selecionado."}
          </p>
          <div>
            <button
              id="single-upload-button"
              type="submit"
              className={`${ui.button} ${ui.primary}`}
            >
              Enviar
            </button>
          </div>
          <Result id="single-upload-result">{singleMessage}</Result>
        </form>
      </Panel>

      <Panel
        title="Input múltiplo"
        description="Aceita várias imagens de uma vez."
      >
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <label htmlFor="multiple-files" className={ui.label}>
              Imagens
            </label>
            <input
              id="multiple-files"
              name="images"
              type="file"
              multiple
              accept="image/*"
              className={FILE_INPUT}
              onChange={(event) =>
                setImages(Array.from(event.target.files ?? []))
              }
            />
          </div>
          <p id="multiple-files-count" className={ui.hint}>
            {images.length === 1
              ? "1 arquivo selecionado"
              : `${images.length} arquivos selecionados`}
          </p>
          <ul id="multiple-files-list" className="grid gap-1 text-sm">
            {images.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1"
              >
                <Paperclip
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="file-name min-w-0 truncate">{file.name}</span>
                <span className="file-size ml-auto text-xs text-muted-foreground">
                  {formatSize(file.size)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel
        title="Input escondido"
        description="O input real tem display: none; o botão só o aciona."
      >
        <div className="grid gap-3">
          <input
            ref={hiddenInputRef}
            id="hidden-file"
            name="document"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const isPdf =
                file.type === "application/pdf" ||
                file.name.toLowerCase().endsWith(".pdf");
              setDocumentMessage(
                isPdf
                  ? { ok: true, text: `Documento recebido: ${file.name}` }
                  : {
                      ok: false,
                      text: `Formato inválido: ${file.name}. Envie um arquivo PDF.`,
                    },
              );
              // Permite escolher o mesmo arquivo de novo.
              event.target.value = "";
            }}
          />
          <div>
            <button
              id="choose-document"
              type="button"
              className={`${ui.button} ${ui.outline}`}
              onClick={() => hiddenInputRef.current?.click()}
            >
              <Paperclip className="size-4" aria-hidden="true" />
              Escolher documento
            </button>
          </div>
          <p className={ui.hint}>Somente PDF.</p>
          <Result
            id="document-result"
            role={documentMessage.ok ? "status" : "alert"}
            data-valid={documentMessage.ok}
            className={documentMessage.ok ? "" : "text-destructive"}
          >
            {documentMessage.text}
          </Result>
        </div>
      </Panel>
    </div>
  );
}
