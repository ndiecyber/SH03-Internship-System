"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInternApplications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { program: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getPublishedPrograms() {
  return await prisma.internshipProgram.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" }
  });
}

export async function applyForProgramAction(formData: {
  programId: string;
  cvUrl: string;
  notes: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Anda harus login terlebih dahulu." };
    }

    if (!formData.programId) return { error: "Program magang tidak valid." };
    if (!formData.cvUrl) return { error: "Link CV wajib diisi." };

    // Check if user has already applied to this program
    const existing = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        programId: formData.programId
      }
    });

    if (existing) {
      return { error: "Anda sudah mendaftar di program magang ini." };
    }

    await prisma.application.create({
      data: {
        userId: session.user.id,
        programId: formData.programId,
        cvUrl: formData.cvUrl,
        notes: formData.notes,
        status: "pending"
      }
    });

    revalidatePath("/intern/internship-registration");
    revalidatePath("/admin/applicants");
    return { success: true };
  } catch (error) {
    console.error("Error creating application:", error);
    return { error: "Gagal mengirim pendaftaran magang." };
  }
}
