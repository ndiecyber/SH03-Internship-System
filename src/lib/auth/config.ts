import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types/roles";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as UserRole;
      }

      return session;
    }
  }
} satisfies NextAuthConfig;
