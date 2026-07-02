"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getInternCertificate() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await prisma.certificate.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        include: {
          internEvaluation: true,
          applications: {
            where: { status: "approved" },
            include: { program: true },
            take: 1
          }
        }
      }
    }
  });
}
