import { z } from "zod";

export const mentorReviewSchema = z.object({
  internId: z.string().min(1),
  notes: z.string().optional()
});
