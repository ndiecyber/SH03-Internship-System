import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(["ADMIN", "MENTOR", "INTERN"]).optional().default("INTERN")
});
