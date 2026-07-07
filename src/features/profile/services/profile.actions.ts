"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/utils/hash";
import { revalidatePath } from "next/cache";

export async function getProfileData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      approvalStatus: true
    }
  });
}

export async function updateProfileAction(data: { name: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Tidak terautentikasi." };

    const name = data.name.trim();
    if (!name || name.length < 2) return { error: "Nama minimal 2 karakter." };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name }
    });

    revalidatePath("/mentor/profile");
    revalidatePath("/intern/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Gagal memperbarui profil." };
  }
}

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Tidak terautentikasi." };

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

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Gagal mengubah password." };
  }
}
