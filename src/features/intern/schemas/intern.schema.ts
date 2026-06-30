import { z } from "zod";

export const internshipRegistrationSchema = z.object({
  programId: z.string().min(1)
});
