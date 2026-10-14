import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { PasswordForm } from "@/components/profile/password-form";
import { ProfileForm } from "@/components/profile/profile-form";
import { FadeIn } from "@/components/shared/fade-in";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/task-labels";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <PageHeader
        title="Meu perfil"
        description="Gerencie seus dados, sua foto e sua senha."
      />

      <FadeIn className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-2">
          <Card data-testid="profile-avatar-card">
            <CardHeader>
              <CardTitle>
                <h2>Foto de perfil</h2>
              </CardTitle>
              <CardDescription>
                A imagem aparece no menu do usuário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarUpload user={user} />
            </CardContent>
          </Card>

          <Card data-testid="profile-data-card">
            <CardHeader>
              <CardTitle>
                <h2>Dados pessoais</h2>
              </CardTitle>
              <CardDescription>Seu nome e uma breve descrição.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* A key recria o formulário quando os dados mudam no servidor. */}
              <ProfileForm key={`${user.name}|${user.bio ?? ""}`} user={user} />
            </CardContent>
          </Card>

          <Card data-testid="profile-password-card">
            <CardHeader>
              <CardTitle>
                <h2>Segurança</h2>
              </CardTitle>
              <CardDescription>Altere a senha de acesso.</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit" data-testid="profile-account-card">
          <CardHeader>
            <CardTitle>
              <h2>Conta</h2>
            </CardTitle>
            <CardDescription>Informações da sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Papel</dt>
                <dd>
                  <Badge
                    variant="secondary"
                    data-testid="profile-role"
                    data-role={user.role}
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">E-mail</dt>
                <dd className="break-all" data-testid="profile-account-email">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Membro desde</dt>
                <dd data-testid="profile-member-since">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">ID do usuário</dt>
                <dd className="font-mono text-xs break-all" data-testid="profile-user-id">
                  {user.id}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </FadeIn>
    </>
  );
}
