import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

// Nunca selecionamos avatarData/passwordHash por padrão.
const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  bio: true,
  avatarMime: true,
  createdAt: true,
  updatedAt: true,
} as const;

type PublicUserRow = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  bio: string | null;
  avatarMime: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toAppUser(row: PublicUserRow): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    bio: row.bio,
    // O parâmetro "v" muda a cada atualização e evita imagem em cache.
    avatarUrl: row.avatarMime
      ? `/api/v1/avatars/${row.id}?v=${row.updatedAt.getTime()}`
      : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getUserById(id: string) {
  const row = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
  return row ? toAppUser(row) : null;
}

/** Retorna o usuário se e-mail e senha estiverem corretos; senão, null. */
export async function verifyCredentials(email: string, password: string) {
  const row = await prisma.user.findUnique({
    where: { email },
    select: { ...publicUserSelect, passwordHash: true },
  });
  if (!row) return null;

  const matches = await bcrypt.compare(password, row.passwordHash);
  return matches ? toAppUser(row) : null;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
