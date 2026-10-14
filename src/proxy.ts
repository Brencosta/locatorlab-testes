import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Instância leve (sem banco), usada só para ler o cookie de sessão.
const { auth } = NextAuth(authConfig);

// Redireciona visitantes não autenticados da área logada para o login.
export default auth((request) => {
  if (request.auth) return;

  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set(
    "callbackUrl",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/challenges/:path*",
    "/api-docs/:path*",
    "/admin/:path*",
    // Páginas auxiliares dos desafios (iframe e nova aba).
    "/embed/:path*",
  ],
};
