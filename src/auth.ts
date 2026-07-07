import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { authConfig } from "@/lib/auth/config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verifyPassword } from "@/utils/hash";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({
          where: { email }
        });
        if (!user || !user.password) {
          return null;
        }

        // Check if user is approved (for INTERN and MENTOR roles)
        if (user.approvalStatus === "PENDING") {
          throw new Error("Akun Anda masih menunggu persetujuan admin.");
        }

        if (user.approvalStatus === "REJECTED") {
          throw new Error("Akun Anda telah ditolak. Hubungi admin untuk informasi lebih lanjut.");
        }

        const passwordsMatch = verifyPassword(password, user.password);
        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image
          };
        }

        return null;
      }
    })
  ]
});
