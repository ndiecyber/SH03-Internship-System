"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function getDashboardStats() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const [
      totalApplicants,
      activeInterns,
      completedInterns,
      totalCertificates,
      pendingApprovals,
      totalMentors,
      pendingLogbooks,
      latestLogbooks
    ] = await Promise.all([
      prisma.application.count(),

      prisma.user.count({
        where: {
          role: "INTERN",
          applications: { some: { status: "approved" } },
          certificate: null
        }
      }),

      prisma.user.count({
        where: {
          role: "INTERN",
          certificate: { isNot: null }
        }
      }),

      prisma.certificate.count(),

      // Pending user registrations (INTERN + MENTOR waiting approval)
      prisma.user.count({
        where: {
          approvalStatus: "PENDING",
          role: { in: ["INTERN", "MENTOR"] }
        }
      }),

      // Total approved mentors
      prisma.user.count({
        where: {
          role: "MENTOR",
          approvalStatus: "APPROVED"
        }
      }),

      // Logbooks not yet reviewed
      prisma.logbook.count({
        where: { status: "pending" }
      }),

      // 5 latest logbooks with status
      prisma.logbook.findMany({
        take: 5,
        orderBy: { date: "desc" },
        select: {
          id: true,
          activity: true,
          date: true,
          progress: true,
          status: true,
          user: {
            select: { id: true, name: true }
          }
        }
      })
    ]);

    return {
      data: {
        totalApplicants,
        activeInterns,
        completedInterns,
        totalCertificates,
        pendingApprovals,
        totalMentors,
        pendingLogbooks,
        latestLogbooks
      }
    };
  } catch (error: unknown) {
    console.error("Error fetching dashboard stats:", error);
    return { error: "Gagal mengambil data dashboard" };
  }
}
