"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getAdminMonitoringLogbooks() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const logbooks = await prisma.logbook.findMany({
      orderBy: { date: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            internRelation: {
              select: {
                mentor: {
                  select: { id: true, name: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    return { data: logbooks };
  } catch (error) {
    console.error("Error fetching admin monitoring logbooks:", error);
    return { error: "Gagal mengambil data monitoring logbook" };
  }
}
