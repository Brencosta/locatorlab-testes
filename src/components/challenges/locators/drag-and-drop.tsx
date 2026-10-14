"use client";

import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { Panel, Result } from "@/components/challenges/ui";

const COLUMNS = [
  { id: "todo", label: "A fazer" },
  { id: "doing", label: "Em andamento" },
  { id: "done", label: "Concluído" },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];

const CARDS = [
  { id: "write-tests", label: "Escrever testes" },
  { id: "review-pr", label: "Revisar PR" },
  { id: "setup-ci", label: "Configurar CI" },
];

const INITIAL_BOARD: Record<string, ColumnId> = {
  "write-tests": "todo",
  "review-pr": "todo",
  "setup-ci": "todo",
};

// Desafio 16, parte 1: drag and drop nativo do HTML5.
function Board() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [over, setOver] = useState<ColumnId | null>(null);
  const [message, setMessage] = useState("Nenhum cartão movido.");

  function handleDrop(event: React.DragEvent, column: ColumnId) {
    event.preventDefault();
    setOver(null);
    const cardId = event.dataTransfer.getData("text/plain");
    const card = CARDS.find((item) => item.id === cardId);
    if (!card || board[card.id] === column) return;

    setBoard({ ...board, [card.id]: column });
    const columnLabel = COLUMNS.find((item) => item.id === column)?.label;
    setMessage(`"${card.label}" movido para "${columnLabel}".`);
  }

  return (
    <Panel
      title="Quadro (HTML5 drag and drop)"
      description="Usa dragstart, dragover e drop."
    >
      <div id="board" className="grid gap-3 sm:grid-cols-3">
        {COLUMNS.map((column) => {
          const cards = CARDS.filter((card) => board[card.id] === column.id);

          return (
            <div
              key={column.id}
              id={`column-${column.id}`}
              data-column={column.id}
              data-drag-over={over === column.id}
              className="flex min-h-40 flex-col gap-2 rounded-lg border-2 border-dashed p-2 transition-colors data-[drag-over=true]:border-primary data-[drag-over=true]:bg-primary/5"
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setOver(column.id);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(event) => handleDrop(event, column.id)}
            >
              <div className="flex items-center justify-between text-sm font-medium">
                <span>{column.label}</span>
                <span
                  id={`count-${column.id}`}
                  className="rounded-full bg-muted px-2 text-xs tabular-nums"
                >
                  {cards.length}
                </span>
              </div>
              {cards.map((card) => (
                <div
                  key={card.id}
                  id={`card-${card.id}`}
                  draggable
                  className="flex cursor-grab items-center gap-1.5 rounded-md border bg-background px-2 py-1.5 text-sm shadow-xs active:cursor-grabbing"
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", card.id);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                >
                  <GripVertical
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {card.label}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <Result id="board-result" className="mt-3">
        {message}
      </Result>
    </Panel>
  );
}

// Desafio 16, parte 2: arraste feito com eventos de ponteiro.
function PointerDrag() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dropped, setDropped] = useState(false);
  const [message, setMessage] = useState("A ficha está na origem.");
  const chipRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (dropped) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    setDragging(true);

    function handleMove(moveEvent: PointerEvent) {
      setOffset({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      setDragging(false);

      // Vale como "solto na área" se o centro da ficha estiver dentro dela.
      const chip = chipRef.current?.getBoundingClientRect();
      const zone = zoneRef.current?.getBoundingClientRect();
      const inside =
        chip !== undefined &&
        zone !== undefined &&
        chip.left + chip.width / 2 >= zone.left &&
        chip.left + chip.width / 2 <= zone.right &&
        chip.top + chip.height / 2 >= zone.top &&
        chip.top + chip.height / 2 <= zone.bottom;

      setOffset({ x: 0, y: 0 });
      if (inside) {
        setDropped(true);
        setMessage("Ficha solta na área de destino!");
      } else {
        setMessage("Ficha solta fora da área: ela voltou para a origem.");
      }
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  const chip = (
    <div
      ref={chipRef}
      id="drag-chip"
      data-dragging={dragging}
      className="z-10 flex h-10 w-28 cursor-grab touch-none items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm select-none data-[dragging=true]:cursor-grabbing data-[dragging=true]:shadow-lg"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerDown={handlePointerDown}
    >
      Arraste-me
    </div>
  );

  return (
    <Panel
      title="Ficha (eventos de ponteiro)"
      description="Responde a pointerdown, pointermove e pointerup."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div
          id="drag-source"
          className="flex h-28 items-center justify-center rounded-lg border"
        >
          {dropped ? (
            <span className="text-sm text-muted-foreground">Origem vazia</span>
          ) : (
            chip
          )}
        </div>
        <div
          ref={zoneRef}
          id="drop-zone"
          data-filled={dropped}
          className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground data-[filled=true]:border-success data-[filled=true]:bg-success/5"
        >
          {dropped ? chip : "Solte a ficha aqui"}
        </div>
      </div>
      <Result id="drop-result" className="mt-3">
        {message}
      </Result>
    </Panel>
  );
}

export function DragAndDropChallenge() {
  return (
    <div className="grid gap-4">
      <Board />
      <PointerDrag />
    </div>
  );
}
