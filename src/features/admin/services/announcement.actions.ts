"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getAnnouncements() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  const items = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } }
  });
  return { data: items };
}

export async function getPublishedAnnouncements(role: "INTERN" | "MENTOR") {
  const items = await prisma.announcement.findMany({
    where: {
      status: "published",
      OR: [{ audience: "all" }, { audience: role === "INTERN" ? "interns" : "mentors" }]
    },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } }
  });
  return items;
}

export async function createAnnouncementAction(data: {
  title: string;
  message: string;
  audience: string;
  status: string;
  eventDate?: string;
  eventTime?: string;
  meetLink?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };
    if (!data.title.trim()) return { error: "Judul wajib diisi." };
    if (!data.message.trim()) return { error: "Pesan wajib diisi." };

    await prisma.announcement.create({
      data: {
        title:     data.title.trim(),
        message:   data.message.trim(),
        audience:  data.audience,
        status:    data.status,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        eventTime: data.eventTime?.trim() || null,
        meetLink:  data.meetLink?.trim() || null,
        createdBy: session.user.id
      }
    });

    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { error: "Gagal membuat pengumuman." };
  }
}

export async function updateAnnouncementAction(
  id: string,
  data: {
    title: string;
    message: string;
    audience: string;
    status: string;
    eventDate?: string;
    eventTime?: string;
    meetLink?: string;
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

    await prisma.announcement.update({
      where: { id },
      data: {
        title:     data.title.trim(),
        message:   data.message.trim(),
        audience:  data.audience,
        status:    data.status,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        eventTime: data.eventTime?.trim() || null,
        meetLink:  data.meetLink?.trim() || null,
      }
    });

    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error updating announcement:", error);
    return { error: "Gagal memperbarui pengumuman." };
  }
}

export async function deleteAnnouncementAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return { error: "Unauthorized" };

    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return { error: "Gagal menghapus pengumuman." };
  }
}
