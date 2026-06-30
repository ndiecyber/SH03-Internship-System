import { z } from "zod";

export const logbookEntrySchema = z.object({
  date: z.coerce.date(),
  summary: z.string().min(1)
});
