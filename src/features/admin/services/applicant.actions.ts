"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendApprovalEmail, sendRejectionEmail } from "@/services/email";

export async function getAllApplications() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return [];
  }

  return await prisma.application.findMany({
    include: {
      user: true,
      program: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function reviewApplicationAction(
  applicationId: string,
  status: "approved" | "rejected",
  reviewNotes?: string
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const app = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        notes: reviewNotes
      },
      include: {
        user: true
      }
    });

    // If approved, automatically assign to the first mentor if they don't have one
    if (status === "approved") {
      const existingAssignment = await prisma.mentorIntern.findUnique({
        where: { internId: app.userId }
      });

      if (!existingAssignment) {
        // Find first approved mentor only
        const firstMentor = await prisma.user.findFirst({
          where: { role: "MENTOR", approvalStatus: "APPROVED" }
        });

        if (firstMentor) {
          await prisma.mentorIntern.create({
            data: {
              mentorId: firstMentor.id,
              internId: app.userId
            }
          });
        }
      }
      
      // Send approval email
      sendApprovalEmail(app.user.email, app.user.name ?? "Peserta").catch(err => console.error("Failed to send approval email:", err));
    } else if (status === "rejected") {
      // Send rejection email
      sendRejectionEmail(app.user.email, app.user.name ?? "Peserta", reviewNotes).catch(err => console.error("Failed to send rejection email:", err));
    }

    revalidatePath("/admin/applicants");
    revalidatePath("/admin/dashboard");
    revalidatePath("/intern/internship-registration");
    revalidatePath("/mentor/assigned-interns");
    return { success: true };
  } catch (error) {
    console.error("Error reviewing application:", error);
    return { error: "Gagal memproses review pendaftaran." };
  }
}
