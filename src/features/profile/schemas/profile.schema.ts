import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional()
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100)
});

const optionalUrl = z.union([z.string().url("Format tautan tidak valid"), z.literal("")]).optional();

export const internProfileSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter").max(100),
  nickname: z.string().max(50).optional(),
  phone: z.string().max(30).optional(),
  gender: z.string().max(30).optional(),
  birthPlace: z.string().max(100).optional(),
  birthDate: z.string().optional(),
  address: z.string().max(1000).optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  institution: z.string().max(150).optional(),
  faculty: z.string().max(150).optional(),
  studyProgram: z.string().max(150).optional(),
  studentId: z.string().max(50).optional(),
  semester: z.coerce.number().int().min(1).max(20).nullable().optional(),
  entryYear: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  graduationYear: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  portfolioUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUsername: z.string().max(39).optional(),
  skills: z.string().max(1000).optional(),
  bio: z.string().max(2000).optional(),
  organizationExperience: z.string().max(2000).optional(),
  workExperience: z.string().max(2000).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"]
  });

const ALLOWED_EMAIL_DOMAINS = ["gmail.com"];
const ALLOWED_EMAIL_SUFFIXES = [".ac.id"];

function isAllowedEmail(email: string): boolean {
  const domain = email.split("@")[1] ?? "";
  return (
    ALLOWED_EMAIL_DOMAINS.includes(domain) ||
    ALLOWED_EMAIL_SUFFIXES.some((suffix) => domain.endsWith(suffix))
  );
}

export const changeEmailSchema = z
  .object({
    newEmail: z
      .string()
      .email("Format email tidak valid")
      .refine(isAllowedEmail, {
        message: "Email harus menggunakan @gmail.com atau domain universitas (contoh: @student.ui.ac.id)"
      }),
    currentPassword: z.string().min(1, "Password wajib diisi untuk konfirmasi")
  });
