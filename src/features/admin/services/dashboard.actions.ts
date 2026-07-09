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
      // Total aplikasi (semua status) — sama dengan yang tampil di halaman Applicants
      prisma.application.count(),

      // Intern aktif: role INTERN, akun APPROVED, punya aplikasi approved, belum punya sertifikat
      // Konsisten dengan halaman Interns (filter tab "Peserta Aktif")
      prisma.user.count({
        where: {
          role: "INTERN",
          approvalStatus: "APPROVED",
          applications: { some: { status: "approved" } },
          certificate: null
        }
      }),

      // Intern selesai: role INTERN, sudah punya sertifikat
      // Konsisten dengan halaman Interns
      prisma.user.count({
        where: {
          role: "INTERN",
          approvalStatus: "APPROVED",
          certificate: { isNot: null }
        }
      }),

      prisma.certificate.count(),

      // Menunggu approval akun: PENDING, role INTERN/MENTOR
      // Konsisten dengan halaman Reports
      prisma.user.count({
        where: {
          approvalStatus: "PENDING",
          role: { in: ["INTERN", "MENTOR"] }
        }
      }),

      // Total mentor: role MENTOR, akun APPROVED, bukan REJECTED
      // Konsisten dengan halaman Mentors (getUsersByRole exclude REJECTED)
      prisma.user.count({
        where: {
          role: "MENTOR",
          approvalStatus: "APPROVED"
        }
      }),

      // Logbook pending review
      // Konsisten dengan halaman Monitoring
      prisma.logbook.count({
        where: { status: "pending" }
      }),

      // 5 logbook terbaru
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
