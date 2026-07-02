"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAssignedInterns() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Fetch all assigned interns
  const assignments = await prisma.mentorIntern.findMany({
    where: { mentorId: session.user.id },
    include: {
      intern: {
        include: {
          internEvaluation: true,
          certificate: true
        }
      }
    }
  });

  return assignments.map((a) => a.intern);
}

export async function submitEvaluationAction(formData: {
  internId: string;
  technicalScore: number;
  attitudeScore: number;
  communicationScore: number;
  attendanceScore: number;
  notes: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Anda harus login terlebih dahulu." };
    }

    const {
      internId,
      technicalScore,
      attitudeScore,
      communicationScore,
      attendanceScore,
      notes
    } = formData;

    if (!internId) return { error: "ID intern tidak valid." };

    const finalScore =
      (technicalScore + attitudeScore + communicationScore + attendanceScore) / 4;

    // Save evaluation
    await prisma.evaluation.create({
      data: {
        internId,
        mentorId: session.user.id,
        technicalScore,
        attitudeScore,
        communicationScore,
        attendanceScore,
        finalScore,
        notes
      }
    });

    // Auto generate Certificate
    const certNumber = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await prisma.certificate.create({
      data: {
        userId: internId,
        certNumber
      }
    });

    revalidatePath("/mentor/evaluation");
    revalidatePath("/intern/certificate");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    return { error: "Gagal menyimpan evaluasi nilai." };
  }
}
