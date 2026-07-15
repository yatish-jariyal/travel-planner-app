import { z } from "zod";
import type { AirportSearchQuery } from "../../../shared/api/contracts.js";

export const airportQuerySchema: z.ZodType<AirportSearchQuery> = z.strictObject({
  keyword: z.string().trim().min(2).max(80),
});
