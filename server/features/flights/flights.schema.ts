import { z } from "zod";
import type { FlightSearchRequest } from "../../../shared/api/contracts.js";

const dateString = z.iso.date();
const locationCode = z
  .string()
  .trim()
  .regex(/^[A-Z]{3}(,[A-Z]{3}){0,9}$/);

export const flightSearchSchema: z.ZodType<FlightSearchRequest> = z
  .strictObject({
    originCode: locationCode,
    destinationCode: locationCode,
    departureDate: dateString,
    returnDate: dateString,
  })
  .refine((value) => value.returnDate >= value.departureDate, {
    path: ["returnDate"],
    message: "Return date must be on or after departure date.",
  });
