// Dados determinísticos do LocatorLab.
// Usado tanto por `prisma db seed` quanto pelo endpoint POST /api/v1/reset.
// Este arquivo só usa imports relativos/pacotes para poder rodar fora do Next.
import type { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

type SeedStatus = "PENDING" | "IN_PROGRESS" | "DONE";
type SeedPriority = "LOW" | "MEDIUM" | "HIGH";

export const SEED_STUDENT_ID = "seed_user_aluno";
export const SEED_ADMIN_ID = "seed_user_admin";

export const SEED_CREDENTIALS = [
  {
    id: SEED_STUDENT_ID,
    role: "STUDENT",
    name: "Aluno Teste",
    email: "aluno@locatorlab.dev",
    password: "Aluno@123",
    bio: "Estudante de automação de testes praticando localizadores e assertions.",
  },
  {
    id: SEED_ADMIN_ID,
    role: "ADMIN",
    name: "Admin LocatorLab",
    email: "admin@locatorlab.dev",
    password: "Admin@123",
    bio: "Professor responsável pelo ambiente de prática.",
  },
] as const;

// Datas fixas: o seed gera sempre exatamente os mesmos registros.
const BASE_DATE = Date.UTC(2025, 0, 6, 12, 0, 0);
const DAY = 24 * 60 * 60 * 1000;

// [título, descrição, status, prioridade, prazo (AAAA-MM-DD) ou null]
type SeedTask = [string, string | null, SeedStatus, SeedPriority, string | null];

const STUDENT_TASKS: SeedTask[] = [
  ["Instalar o Node.js e o VS Code", "Preparar o ambiente local para as aulas.", "DONE", "LOW", "2025-01-10"],
  ["Configurar o projeto Cypress", "Criar o repositório e rodar o teste de exemplo.", "DONE", "HIGH", "2025-01-12"],
  ["Escrever o primeiro teste de login", "Cobrir login válido e senha incorreta.", "DONE", "HIGH", "2025-01-15"],
  ["Estudar seletores CSS", "Combinadores, atributos e pseudo-classes.", "DONE", "MEDIUM", "2025-01-17"],
  ["Praticar XPath com eixos", "following-sibling, ancestor e contains().", "IN_PROGRESS", "HIGH", "2030-03-01"],
  ["Localizar elementos por data-testid", "Comparar com id, name e class.", "DONE", "MEDIUM", null],
  ["Revisar localizadores por role e ARIA", "getByRole, getByLabelText e aria-label.", "IN_PROGRESS", "MEDIUM", "2030-03-05"],
  ["Automatizar o CRUD de tarefas", "Criar, editar, concluir e excluir uma tarefa.", "PENDING", "HIGH", "2030-03-10"],
  ["Validar mensagens de erro do formulário", "Campo vazio, e-mail inválido e senha curta.", "PENDING", "MEDIUM", "2025-02-01"],
  ["Testar a paginação da lista", "Verificar quantidade de itens por página.", "PENDING", "LOW", "2030-03-15"],
  ["Criar assertions de texto e visibilidade", null, "DONE", "MEDIUM", "2025-01-24"],
  ["Criar assertions de atributo e estado", "disabled, checked, aria-invalid.", "IN_PROGRESS", "MEDIUM", "2030-03-20"],
  ["Validar a URL após o login", "Deve redirecionar para /dashboard.", "DONE", "LOW", null],
  ["Testar a API de tarefas com cy.request", "GET, POST, PATCH e DELETE.", "PENDING", "HIGH", "2030-04-01"],
  ["Validar status codes da API", "200, 201, 204, 400, 401, 403 e 404.", "PENDING", "HIGH", "2025-02-10"],
  ["Configurar o Playwright", "Instalar navegadores e rodar em modo headed.", "IN_PROGRESS", "MEDIUM", "2030-04-05"],
  ["Comparar Selenium, Cypress e Playwright", "Montar uma tabela com prós e contras.", "PENDING", "LOW", null],
  ["Usar esperas explícitas no Selenium", "WebDriverWait e ExpectedConditions.", "PENDING", "MEDIUM", "2030-04-10"],
  ["Testar upload de avatar", "Enviar um arquivo PNG e validar a prévia.", "PENDING", "LOW", "2030-04-12"],
  ["Automatizar o filtro por status", "Validar que só aparecem tarefas do status escolhido.", "IN_PROGRESS", "MEDIUM", "2025-02-20"],
  ["Testar o modo escuro", "Verificar a classe 'dark' no elemento html.", "PENDING", "LOW", null],
  ["Aplicar o padrão Page Object", "Refatorar os testes de login e tarefas.", "IN_PROGRESS", "HIGH", "2030-04-20"],
  ["Rodar os testes no GitHub Actions", "Pipeline com execução a cada push.", "PENDING", "MEDIUM", "2030-05-01"],
  ["Gerar relatório de execução", "Publicar o relatório HTML como artefato.", "DONE", "LOW", "2025-02-28"],
];

const ADMIN_TASKS: SeedTask[] = [
  ["Preparar a aula de localizadores", "Slides e exemplos ao vivo.", "DONE", "HIGH", "2025-01-08"],
  ["Revisar os exercícios de XPath", null, "IN_PROGRESS", "MEDIUM", "2030-03-02"],
  ["Publicar o gabarito da lista 1", "Disponibilizar no repositório da turma.", "PENDING", "MEDIUM", "2030-03-12"],
  ["Corrigir os projetos finais", "Avaliar cobertura e qualidade dos seletores.", "PENDING", "HIGH", "2030-06-15"],
  ["Restaurar o banco antes da aula", "Chamar o endpoint de reset.", "DONE", "LOW", null],
  ["Planejar os desafios de assertions", "Definir os cenários da próxima etapa.", "PENDING", "LOW", "2025-03-01"],
];

function buildTasks(): Prisma.TaskCreateManyInput[] {
  const all: Array<{ task: SeedTask; userId: string }> = [
    ...STUDENT_TASKS.map((task) => ({ task, userId: SEED_STUDENT_ID })),
    ...ADMIN_TASKS.map((task) => ({ task, userId: SEED_ADMIN_ID })),
  ];

  return all.map(({ task, userId }, index) => {
    const [title, description, status, priority, dueDate] = task;
    const createdAt = new Date(BASE_DATE + index * DAY);
    const completedAt =
      status === "DONE" ? new Date(createdAt.getTime() + 2 * DAY) : null;

    return {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null,
      completedAt,
      createdAt,
      updatedAt: completedAt ?? createdAt,
      userId,
    };
  });
}

function buildUsers(): Prisma.UserCreateManyInput[] {
  const createdAt = new Date(BASE_DATE - DAY);
  return SEED_CREDENTIALS.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: bcrypt.hashSync(user.password, 10),
    role: user.role,
    bio: user.bio,
    createdAt,
    updatedAt: createdAt,
  }));
}

/**
 * Apaga todos os dados e recria os registros do seed.
 * Os IDs das tarefas voltam a começar em 1 (RESTART IDENTITY).
 */
export async function resetDatabase(prisma: PrismaClient) {
  const users = buildUsers();
  const tasks = buildTasks();

  await prisma.$transaction([
    prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "Task", "User" RESTART IDENTITY CASCADE',
    ),
    prisma.user.createMany({ data: users }),
    prisma.task.createMany({ data: tasks }),
  ]);

  return { users: users.length, tasks: tasks.length };
}
