"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Panel, Result, ui } from "@/components/challenges/ui";

const CHANNELS = [
  { value: "email", label: "E-mail", disabled: false },
  { value: "sms", label: "SMS", disabled: false },
  { value: "push", label: "Push", disabled: false },
  { value: "whatsapp", label: "WhatsApp (indisponível)", disabled: true },
];
const ENABLED_CHANNELS = CHANNELS.filter((item) => !item.disabled).map(
  (item) => item.value,
);

const PLANS = [
  { value: "free", label: "Gratuito", disabled: false },
  { value: "pro", label: "Pro", disabled: false },
  { value: "team", label: "Equipe", disabled: false },
  { value: "enterprise", label: "Corporativo (sob consulta)", disabled: true },
];

function Switch({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span id={`${id}-label`} className="text-sm">
        {label}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full bg-input transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:bg-primary"
        onClick={() => onChange(!checked)}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-background shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}

// Desafio 13: checkboxes, radios e toggles, nativos e customizados.
export function SelectionControlsChallenge() {
  const [channels, setChannels] = useState<string[]>([]);
  const [plan, setPlan] = useState("free");
  const [autosave, setAutosave] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [offers, setOffers] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allSelected = ENABLED_CHANNELS.every((value) => channels.includes(value));
  const someSelected = channels.length > 0 && !allSelected;

  // "indeterminate" só existe como propriedade do DOM, não como atributo.
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  function toggleChannel(value: string, checked: boolean) {
    setChannels(
      checked ? [...channels, value] : channels.filter((item) => item !== value),
    );
  }

  const channelLabels = CHANNELS.filter((item) =>
    channels.includes(item.value),
  ).map((item) => item.label);
  const planLabel = PLANS.find((item) => item.value === plan)?.label;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Checkboxes" description="Canais de notificação.">
          <fieldset id="channels" className="grid gap-2">
            <legend className="sr-only">Canais de notificação</legend>
            <label
              htmlFor="channel-all"
              className="flex items-center gap-2 border-b pb-2 text-sm font-medium"
            >
              <input
                ref={selectAllRef}
                id="channel-all"
                name="channelAll"
                type="checkbox"
                className={ui.check}
                checked={allSelected}
                onChange={(event) =>
                  setChannels(event.target.checked ? ENABLED_CHANNELS : [])
                }
              />
              Selecionar todas
            </label>
            {CHANNELS.map((item) => (
              <label
                key={item.value}
                htmlFor={`channel-${item.value}`}
                className={`flex items-center gap-2 text-sm ${
                  item.disabled ? "text-muted-foreground" : ""
                }`}
              >
                <input
                  id={`channel-${item.value}`}
                  name="channels"
                  type="checkbox"
                  value={item.value}
                  className={ui.check}
                  disabled={item.disabled}
                  checked={channels.includes(item.value)}
                  onChange={(event) =>
                    toggleChannel(item.value, event.target.checked)
                  }
                />
                {item.label}
              </label>
            ))}
          </fieldset>
        </Panel>

        <Panel title="Radio buttons" description="Só um plano por vez.">
          <fieldset id="plans" className="grid gap-2">
            <legend className="sr-only">Plano</legend>
            {PLANS.map((item) => (
              <label
                key={item.value}
                htmlFor={`plan-${item.value}`}
                className={`flex items-center gap-2 text-sm ${
                  item.disabled ? "text-muted-foreground" : ""
                }`}
              >
                <input
                  id={`plan-${item.value}`}
                  name="plan"
                  type="radio"
                  value={item.value}
                  className={ui.check}
                  disabled={item.disabled}
                  checked={plan === item.value}
                  onChange={() => setPlan(item.value)}
                />
                {item.label}
              </label>
            ))}
          </fieldset>
        </Panel>

        <Panel title="Toggles" description="Botões com role=&quot;switch&quot;.">
          <div className="grid gap-3">
            <Switch
              id="toggle-autosave"
              label="Salvar automaticamente"
              checked={autosave}
              onChange={setAutosave}
            />
            <Switch
              id="toggle-sounds"
              label="Notificações sonoras"
              checked={sounds}
              onChange={setSounds}
            />

            {/* Checkbox customizado: o input real fica invisível e quem
                aparece é o quadrado desenhado ao lado. */}
            <label
              htmlFor="offers"
              className="flex cursor-pointer items-center gap-2 border-t pt-3 text-sm"
            >
              <input
                id="offers"
                name="offers"
                type="checkbox"
                className="peer sr-only"
                checked={offers}
                onChange={(event) => setOffers(event.target.checked)}
              />
              <span
                aria-hidden="true"
                className="custom-checkbox flex size-4 shrink-0 items-center justify-center rounded border border-input text-primary-foreground peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50"
              >
                {offers ? <Check className="size-3" /> : null}
              </span>
              Aceito receber ofertas
            </label>
          </div>
        </Panel>
      </div>

      <Result id="selection-summary">
        <span id="summary-channels" className="block">
          Notificações:{" "}
          {channelLabels.length > 0 ? channelLabels.join(", ") : "nenhuma"}
        </span>
        <span id="summary-plan" className="block">
          Plano: {planLabel}
        </span>
        <span id="summary-toggles" className="block">
          Salvar automaticamente: {autosave ? "ligado" : "desligado"} ·
          Notificações sonoras: {sounds ? "ligado" : "desligado"} · Ofertas:{" "}
          {offers ? "sim" : "não"}
        </span>
      </Result>
    </div>
  );
}
