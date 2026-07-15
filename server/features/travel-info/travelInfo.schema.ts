import { z } from "zod";
import type { TravelInfoRequest } from "../../../shared/api/contracts.js";

export const travelInfoSchema: z.ZodType<TravelInfoRequest> = z
  .strictObject({
    destinationCity: z.string().trim().min(1).max(100),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .refine((value) => value.endDate >= value.startDate, {
    path: ["endDate"],
    message: "Return date must be on or after departure date.",
  });
