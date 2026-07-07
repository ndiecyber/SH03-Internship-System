import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(["ADMIN", "MENTOR", "INTERN"]).optional().default("INTERN")
}).refine(
  (data) => {
    // For INTERN and MENTOR roles, email must be @gmail.com
    if ((data.role === "INTERN" || data.role === "MENTOR") && !data.email.endsWith("@gmail.com")) {
      return false;
    }
    // ADMIN can use any email
    return true;
  },
  {
    message: "Email untuk role Intern dan Mentor harus menggunakan @gmail.com",
    path: ["email"]
  }
);
