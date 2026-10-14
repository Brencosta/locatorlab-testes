import { prisma } from "@/lib/prisma";

// Consultas do painel do professor. Quem chama é responsável por checar a
// permissão antes (getCurrentAdmin ou requireApiAdmin).

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  hasAvatar: boolean;
  taskCount: number;
  createdAt: string;
};

/** Todos os usuários: admins primeiro, depois por data de cadastro. */
export async function listUsers(): Promise<AdminUser[]> {
  const rows = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarMime: true,
      createdAt: true,
      _count: { select: { tasks: true } },
    },
    orderBy: [{ role: "desc" }, { createdAt: "asc" }, { email: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    hasAvatar: row.avatarMime !== null,
    taskCount: row._count.tasks,
    createdAt: row.createdAt.toISOString(),
  }));
}
