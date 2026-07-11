"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function getDashboardStats() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Chart periode 20 Jun – 20 Okt 2026 dibangun di bawah setelah query utama

    const [
      totalApplicants,
      totalInterns,
      activeInterns,
      completedInterns,
      totalCertificates,
      pendingApprovals,
      totalMentors,
      pendingLogbooks,
      latestApplications,
      programStatusCounts,
    ] = await Promise.all([
      prisma.application.count(),

      // Total intern APPROVED
      prisma.user.count({
        where: { role: "INTERN", approvalStatus: "APPROVED" }
      }),

      // Intern aktif: APPROVED + punya aplikasi approved + belum punya sertifikat
      prisma.user.count({
        where: {
          role: "INTERN",
          approvalStatus: "APPROVED",
          applications: { some: { status: "approved" } },
          certificate: null
        }
      }),

      // Intern selesai: sudah punya sertifikat
      prisma.user.count({
        where: {
          role: "INTERN",
          approvalStatus: "APPROVED",
          certificate: { isNot: null }
        }
      }),

      prisma.certificate.count(),

      prisma.user.count({
        where: {
          approvalStatus: "PENDING",
          role: { in: ["INTERN", "MENTOR"] }
        }
      }),

      prisma.user.count({
        where: { role: "MENTOR", approvalStatus: "APPROVED" }
      }),

      prisma.logbook.count({ where: { status: "pending" } }),

      // 5 aplikasi terbaru
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          createdAt: true,
          cvUrl: true,
          user: { select: { id: true, name: true, email: true } },
          program: { select: { title: true } }
        }
      }),

      // Status program: count per status
      prisma.internshipProgram.groupBy({
        by: ["status"],
        _count: { _all: true }
      }),
    ]);

    // Chart: intern on going vs completed per minggu — periode 20 Jun s/d 20 Okt 2026
    // Setiap titik = 1 minggu, label = tanggal mulai minggu tsb
    // On Going  = aplikasi yang diapprove dalam minggu itu
    // Completed = sertifikat yang diterbitkan dalam minggu itu
    const PERIOD_START = new Date("2026-06-20T00:00:00.000Z");
    const PERIOD_END   = new Date("2026-10-20T23:59:59.999Z");

    // Buat array awal setiap minggu dari PERIOD_START sampai PERIOD_END
    const weekStarts: Date[] = [];
    const cursor = new Date(PERIOD_START);
    while (cursor <= PERIOD_END) {
      weekStarts.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 7);
    }

    const internChartData = await Promise.all(
      weekStarts.map(async (weekStart) => {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // Jangan melewati PERIOD_END
        const end = weekEnd > PERIOD_END ? PERIOD_END : weekEnd;

        const [onGoing, completed] = await Promise.all([
          prisma.application.count({
            where: {
              status: "approved",
              updatedAt: { gte: weekStart, lte: end }
            }
          }),
          prisma.certificate.count({
            where: { issuedAt: { gte: weekStart, lte: end } }
          })
        ]);

        // Label: "20 Jun", "27 Jun", "4 Jul", dst.
        const label = weekStart.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          timeZone: "Asia/Jakarta"
        });

        return { date: label, onGoing, completed };
      })
    );

    // Program status pie data
    const programPieData = programStatusCounts.map((p) => ({
      name:
        p.status === "published"
          ? "On Going"
          : p.status === "closed"
          ? "Completed"
          : "Upcoming",
      value: p._count._all
    }));

    return {
      data: {
        totalApplicants,
        totalInterns,
        activeInterns,
        completedInterns,
        totalCertificates,
        pendingApprovals,
        totalMentors,
        pendingLogbooks,
        latestApplications,
        internChartData,
        programPieData
      }
    };
  } catch (error: unknown) {
    console.error("Error fetching dashboard stats:", error);
    return { error: "Gagal mengambil data dashboard" };
  }
}
