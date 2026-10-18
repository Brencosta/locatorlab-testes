import { PrismaClient } from "@prisma/client";
import {
  resetDatabase,
  SEED_ADMIN,
  SEED_STUDENT,
  SeedConfigError,
} from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  const counts = await resetDatabase(prisma);
  console.log(
    `Seed concluído: ${counts.users} usuários e ${counts.tasks} tarefas.`,
  );
  console.log(`  aluno ${SEED_STUDENT.email} / ${SEED_STUDENT.password}`);
  // A senha do admin não é exibida: é a definida em ADMIN_PASSWORD.
  console.log(`  admin ${SEED_ADMIN.email} / (senha da variável ADMIN_PASSWORD)`);
}

main()
  .catch((error) => {
    if (error instanceof SeedConfigError) {
      console.error(`Seed não executado: ${error.message}`);
      console.error("Defina ADMIN_PASSWORD no arquivo .env e rode de novo.");
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
