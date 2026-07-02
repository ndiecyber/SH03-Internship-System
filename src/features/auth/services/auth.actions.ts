"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/utils/hash";
import { registerSchema } from "../schemas/auth.schema";

export async function registerAction(formData: Record<string, string>) {
  try {
    const validatedData = registerSchema.safeParse(formData);
    if (!validatedData.success) {
      return { error: "Data input tidak valid." };
    }

    const { email, password, name, role } = validatedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar." };
    }

    const hashedPassword = hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "INTERN"
      }
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error during registration:", error);
    return { error: "Terjadi kesalahan sistem saat mendaftar." };
  }
}
