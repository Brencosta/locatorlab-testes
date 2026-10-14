import type {
  TaskPriority,
  TaskSort,
  TaskStatus,
} from "@/lib/validations/task";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const SORT_LABELS: Record<TaskSort, string> = {
  newest: "Mais recentes",
  oldest: "Mais antigas",
  dueDate: "Prazo mais próximo",
  title: "Título (A-Z)",
  priority: "Maior prioridade",
};

export const ROLE_LABELS = {
  STUDENT: "Aluno",
  ADMIN: "Admin",
} as const;
