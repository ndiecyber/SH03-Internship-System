"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function getDashboardStats() {
  try {
    const session = await auth();
    
    // Only admin can view dashboard stats
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const totalApplicants = await prisma.application.count();
    
    const activeInterns = await prisma.user.count({
      where: {
        role: "INTERN",
        applications: { some: { status: "approved" } },
        certificate: null
      }
    });

    const completedInterns = await prisma.user.count({
      where: {
        role: "INTERN",
        certificate: { isNot: null }
      }
    });

    const totalCertificates = await prisma.certificate.count();

    // Fetch 5 latest logbooks
    const latestLogbooks = await prisma.logbook.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      data: {
        totalApplicants,
        activeInterns,
        completedInterns,
        totalCertificates,
        latestLogbooks
      }
    };
  } catch (error: unknown) {
    console.error("Error fetching dashboard stats:", error);
    return { error: "Gagal mengambil data dashboard" };
  }
}
