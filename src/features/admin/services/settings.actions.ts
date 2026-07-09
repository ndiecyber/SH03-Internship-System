"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/utils/hash";
import { revalidatePath } from "next/cache";

export async function updateAdminNameAction(data: { name: string }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const name = data.name.trim();
    if (!name || name.length < 2) return { error: "Nama minimal 2 karakter." };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name }
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating admin name:", error);
    return { error: "Gagal memperbarui nama." };
  }
}

export async function changeAdminPasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (data.newPassword !== data.confirmPassword) {
      return { error: "Konfirmasi password tidak cocok." };
    }
    if (data.newPassword.length < 8) {
      return { error: "Password baru minimal 8 karakter." };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true }
    });

    if (!user?.password) return { error: "Akun tidak memiliki password." };

    const isMatch = verifyPassword(data.currentPassword, user.password);
    if (!isMatch) return { error: "Password saat ini salah." };

    const hashed = hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed }
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error changing admin password:", error);
    return { error: "Gagal mengubah password." };
  }
}
