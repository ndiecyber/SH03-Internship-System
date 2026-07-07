"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInternLogbooks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.logbook.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" }
  });
}

export async function createLogbookAction(formData: {
  activity: string;
  progress: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Anda harus login terlebih dahulu." };
    }

    if (!formData.activity) return { error: "Detail aktivitas wajib diisi." };
    if (formData.progress === undefined || formData.progress < 0 || formData.progress > 100) {
      return { error: "Progress harus berada di antara 0% dan 100%." };
    }

    await prisma.logbook.create({
      data: {
        userId: session.user.id,
        activity: formData.activity,
        progress: formData.progress,
        status: "pending"
      }
    });

    revalidatePath("/intern/logbook");
    revalidatePath("/intern/progress");
    revalidatePath("/mentor/logbook-review");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating logbook:", error);
    return { error: "Gagal menyimpan logbook." };
  }
}

export async function getMentorLogbooks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Find all interns assigned to this mentor
  const assignments = await prisma.mentorIntern.findMany({
    where: { mentorId: session.user.id }
  });

  const internIds = assignments.map((a) => a.internId);

  return await prisma.logbook.findMany({
    where: { userId: { in: internIds } },
    include: { user: true },
    orderBy: { date: "desc" }
  });
}

export async function reviewLogbookAction(
  logbookId: string,
  status: "approved" | "rejected",
  feedback?: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    // Verify the logbook belongs to one of this mentor's interns
    const assignment = await prisma.mentorIntern.findFirst({
      where: {
        mentorId: session.user.id,
        intern: { logbooks: { some: { id: logbookId } } }
      }
    });
    if (!assignment) return { error: "Forbidden" };

    await prisma.logbook.update({
      where: { id: logbookId },
      data: {
        status,
        feedback
      }
    });

    revalidatePath("/intern/logbook");
    revalidatePath("/intern/progress");
    revalidatePath("/mentor/logbook-review");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error reviewing logbook:", error);
    return { error: "Gagal menyimpan review logbook." };
  }
}
