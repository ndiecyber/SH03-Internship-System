"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPrograms() {
  return await prisma.internshipProgram.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } }
  });
}

export async function createProgramAction(data: {
  title: string;
  description: string;
  period: string;
  status: string;
}) {
  try {
    if (!data.title) return { error: "Judul program wajib diisi." };

    await prisma.internshipProgram.create({
      data: {
        title: data.title,
        description: data.description,
        period: data.period,
        status: data.status || "published"
      }
    });

    revalidatePath("/admin/internship-programs");
    revalidatePath("/intern/internship-registration");
    return { success: true };
  } catch (error) {
    console.error("Error creating program:", error);
    return { error: "Gagal membuat program magang." };
  }
}

export async function updateProgramAction(
  id: string,
  data: { title: string; description: string; period: string; status: string }
) {
  try {
    await prisma.internshipProgram.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        period: data.period,
        status: data.status
      }
    });

    revalidatePath("/admin/internship-programs");
    revalidatePath("/intern/internship-registration");
    return { success: true };
  } catch (error) {
    console.error("Error updating program:", error);
    return { error: "Gagal memperbarui program magang." };
  }
}

export async function deleteProgramAction(id: string) {
  try {
    await prisma.internshipProgram.delete({
      where: { id }
    });

    revalidatePath("/admin/internship-programs");
    revalidatePath("/intern/internship-registration");
    return { success: true };
  } catch (error) {
    console.error("Error deleting program:", error);
    return { error: "Gagal menghapus program magang." };
  }
}
