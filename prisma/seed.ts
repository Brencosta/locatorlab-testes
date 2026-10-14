import { PrismaClient } from "@prisma/client";
import { resetDatabase, SEED_CREDENTIALS } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  const counts = await resetDatabase(prisma);
  console.log(
    `Seed concluído: ${counts.users} usuários e ${counts.tasks} tarefas.`,
  );
  for (const credential of SEED_CREDENTIALS) {
    console.log(
      `  ${credential.role.padEnd(7)} ${credential.email} / ${credential.password}`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
