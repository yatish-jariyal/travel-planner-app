import { z } from "zod";

export const airportQuerySchema = z.strictObject({
  keyword: z.string().trim().min(2).max(80),
});
