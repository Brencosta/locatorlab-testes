import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { FadeIn } from "@/components/shared/fade-in";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Criar conta" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <FadeIn className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight" data-testid="page-title">
          Criar conta
        </h1>
        <p className="text-sm text-muted-foreground">
          Cadastre-se como aluno para começar a praticar.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
          data-testid="register-login-link"
        >
          Entrar
        </Link>
      </p>
    </FadeIn>
  );
}
