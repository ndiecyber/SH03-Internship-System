"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getPendingRegistrations() {
  try {
    const session = await auth();
    
    // Only admin can view pending registrations
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const pendingUsers = await prisma.user.findMany({
      where: {
        approvalStatus: "PENDING",
        role: { in: ["INTERN", "MENTOR"] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    return { data: pendingUsers };
  } catch (error: unknown) {
    console.error("Error fetching pending registrations:", error);
    return { error: "Gagal mengambil data registrasi pending" };
  }
}

export async function approveRegistration(userId: string) {
  try {
    const session = await auth();
    
    // Only admin can approve
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
        approvedBy: session.user.id
      }
    });

    // Revalidate the reports page to refresh data
    revalidatePath("/admin/reports");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Error approving registration:", error);
    return { error: "Gagal menyetujui registrasi" };
  }
}

export async function rejectRegistration(userId: string, reason?: string) {
  try {
    const session = await auth();
    
    // Only admin can reject
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: "REJECTED",
        rejectedAt: new Date(),
        approvalReason: reason,
        approvedBy: session.user.id
      }
    });

    // Revalidate the reports page to refresh data
    revalidatePath("/admin/reports");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Error rejecting registration:", error);
    return { error: "Gagal menolak registrasi" };
  }
}
