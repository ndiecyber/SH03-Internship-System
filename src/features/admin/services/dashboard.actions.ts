"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function getDashboardStats() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const PERIOD_START = new Date("2026-06-20T00:00:00.000Z");
    const PERIOD_END   = new Date("2026-10-20T23:59:59.999Z");

    // Jalankan semua query secara paralel untuk performa maksimal
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
      chartApplications,
      chartCertificates,
    ] = await Promise.all([
      prisma.application.count(),
      prisma.user.count({ where: { role: "INTERN", approvalStatus: "APPROVED" } }),
      prisma.user.count({
        where: { role: "INTERN", approvalStatus: "APPROVED", applications: { some: { status: "approved" } }, certificate: null }
      }),
      prisma.user.count({
        where: { role: "INTERN", approvalStatus: "APPROVED", certificate: { isNot: null } }
      }),
      prisma.certificate.count(),
      prisma.user.count({
        where: { approvalStatus: "PENDING", role: { in: ["INTERN", "MENTOR"] } }
      }),
      prisma.user.count({ where: { role: "MENTOR", approvalStatus: "APPROVED" } }),
      prisma.logbook.count({ where: { status: "pending" } }),
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, status: true, createdAt: true, cvUrl: true,
          user: { select: { id: true, name: true, email: true } },
          program: { select: { title: true } }
        }
      }),
      prisma.internshipProgram.groupBy({
        by: ["status"],
        _count: { _all: true }
      }),
      prisma.application.findMany({
        where: { status: "approved", updatedAt: { gte: PERIOD_START, lte: PERIOD_END } },
        select: { updatedAt: true }
      }),
      prisma.certificate.findMany({
        where: { issuedAt: { gte: PERIOD_START, lte: PERIOD_END } },
        select: { issuedAt: true }
      }),
    ]);

    // Buat array awal setiap minggu
    const weekStarts: Date[] = [];
    const cursor = new Date(PERIOD_START);
    while (cursor <= PERIOD_END) {
      weekStarts.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 7);
    }

    // Proses di memory — tidak ada DB call di dalam loop
    const internChartData = weekStarts.map((weekStart) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const end = weekEnd > PERIOD_END ? PERIOD_END : weekEnd;

      const onGoing = chartApplications.filter(
        (a) => a.updatedAt >= weekStart && a.updatedAt <= end
      ).length;

      const completed = chartCertificates.filter(
        (c) => c.issuedAt >= weekStart && c.issuedAt <= end
      ).length;

      const label = weekStart.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        timeZone: "Asia/Jakarta"
      });

      return { date: label, onGoing, completed };
    });

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
