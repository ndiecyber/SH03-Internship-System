import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional()
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100)
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
