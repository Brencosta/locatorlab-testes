export { cn } from "cn";

const APP_TIME_ZONE = "America/Sao_Paulo";

/** Data de hoje (AAAA-MM-DD) no fuso do Brasil. */
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE }).format(
    new Date(),
  );
}

/** "2030-03-01" -> "01/03/2030" */
export function formatDate(isoDate: string | null) {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

/** Data e hora completas a partir de um ISO datetime. */
export function formatDateTime(isoDateTime: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(new Date(isoDateTime));
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

/** Tarefa não concluída com prazo anterior a hoje. */
export function isOverdue(task: { status: string; dueDate: string | null }) {
  return (
    task.status !== "DONE" && task.dueDate !== null && task.dueDate < todayISO()
  );
}
