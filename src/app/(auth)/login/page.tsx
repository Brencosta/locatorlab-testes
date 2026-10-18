import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { FadeIn } from "@/components/shared/fade-in";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Entrar" };

// Só aceita caminhos internos, para evitar redirecionamento para outros sites.
function safeCallbackUrl(value: string | string[] | undefined) {
  const url = Array.isArray(value) ? value[0] : value;
  if (!url || !url.startsWith("/") || url.startsWith("//") || url.includes("\\")) {
    return "/dashboard";
  }
  return url;
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const { callbackUrl } = await searchParams;

  return (
    <FadeIn className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight" data-testid="page-title">
          Entrar no LocatorLab
        </h1>
        <p className="text-sm text-muted-foreground">
          Use sua conta para acessar o ambiente de prática.
        </p>
      </div>

      <LoginForm callbackUrl={safeCallbackUrl(callbackUrl)} />

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
          data-testid="login-register-link"
        >
          Criar conta
        </Link>
      </p>

      <section
        aria-labelledby="test-credentials-title"
        className="rounded-lg border border-dashed bg-muted/40 p-3 text-sm"
        data-testid="test-credentials"
      >
        <h2 id="test-credentials-title" className="mb-1.5 font-medium">
          Credenciais de teste
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
          <dt>Aluno</dt>
          <dd className="font-mono text-xs break-all">
            aluno@locatorlab.dev / Aluno@123
          </dd>
        </dl>
      </section>
    </FadeIn>
  );
}
