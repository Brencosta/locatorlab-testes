import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BugModeCard } from "@/components/admin/bug-mode-card";
import { ResetDatabaseCard } from "@/components/admin/reset-database-card";
import { UsersTable } from "@/components/admin/users-table";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { AccessDenied } from "@/components/shared/states";
import { buttonVariants } from "@/components/ui/button";
import { listUsers } from "@/lib/admin";
import { getBugMode } from "@/lib/bugs/server";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Painel Admin" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Checagem no servidor: nenhum dado do painel é consultado para quem não é
  // admin. As ações e a API do painel repetem esta checagem.
  if (user.role !== "ADMIN") {
    return (
      <AccessDenied
        action={
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline" })}
            data-testid="access-denied-back-link"
          >
            Voltar para o dashboard
          </Link>
        }
      />
    );
  }

  const [users, bugMode] = await Promise.all([listUsers(), getBugMode()]);

  return (
    <>
      <PageHeader
        title="Painel Admin"
        description="Ferramentas do professor: usuários, restauração do banco e Modo Bug."
      />

      <FadeIn className="grid gap-4">
        <div className="grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
          <BugModeCard enabled={bugMode} />
          <ResetDatabaseCard />
        </div>
        <UsersTable users={users} currentUserId={user.id} />
      </FadeIn>
    </>
  );
}
