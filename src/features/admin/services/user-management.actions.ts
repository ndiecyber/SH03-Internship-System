"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { UserRole } from "@/types/roles";

export async function getUsersByRole(role: UserRole) {
  try {
    const session = await auth();
    
    // Only admin can view users
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const users = await prisma.user.findMany({
      where: {
        role,
        // Exclude admin users
        NOT: { role: "ADMIN" }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approvalStatus: true,
        createdAt: true,
        approvedAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    return { data: users };
  } catch (error: unknown) {
    console.error(`Error fetching ${role} users:`, error);
    return { error: `Gagal mengambil data ${role}` };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth();
    
    // Only admin can delete users
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    return { error: "Gagal menghapus pengguna" };
  }
}
