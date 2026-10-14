import type { NextAuthConfig } from "next-auth";

// Configuração sem acesso ao banco: é compartilhada com o proxy (src/proxy.ts),
// que só precisa ler o cookie de sessão.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as typeof session.user.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
