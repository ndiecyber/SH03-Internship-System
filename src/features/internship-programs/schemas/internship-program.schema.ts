import { z } from "zod";

export const internshipProgramSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});
