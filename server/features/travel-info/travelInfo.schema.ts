import { z } from "zod";

export const travelInfoSchema = z
  .strictObject({
    destinationCity: z.string().trim().min(1).max(100),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
  })
  .refine((value) => value.endDate >= value.startDate, {
    path: ["endDate"],
    message: "Return date must be on or after departure date.",
  });
