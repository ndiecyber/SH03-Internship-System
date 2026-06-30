import { z } from "zod";

export const adminFilterSchema = z.object({
  search: z.string().optional()
});
