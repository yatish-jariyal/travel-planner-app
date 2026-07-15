import { z } from "zod";

const dateString = z.iso.date();
const locationCode = z
  .string()
  .trim()
  .regex(/^[A-Z]{3}(,[A-Z]{3}){0,9}$/);

export const airportQuerySchema = z.strictObject({
  keyword: z.string().trim().min(2).max(80),
});

export const flightSearchSchema = z.strictObject({
  originCode: locationCode,
  destinationCode: locationCode,
  departureDate: dateString,
  returnDate: dateString,
}).refine((value) => value.returnDate >= value.departureDate, {
  path: ["returnDate"],
  message: "Return date must be on or after departure date.",
});

export const travelInfoSchema = z
  .strictObject({
    destinationCity: z.string().trim().min(1).max(100),
    startDate: dateString,
    endDate: dateString,
  })
  .refine((value) => value.endDate >= value.startDate, {
    path: ["endDate"],
    message: "Return date must be on or after departure date.",
  });
