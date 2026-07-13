import { z } from "zod";

const dateString = z.iso.date();
const locationCode = z.string().trim().regex(/^[A-Z]{3}$/);

export const airportQuerySchema = z.strictObject({
  keyword: z.string().trim().min(2).max(80),
});

export const flightSearchSchema = z.strictObject({
  currencyCode: z.string().trim().regex(/^[A-Z]{3}$/),
  originDestinations: z
    .array(
      z.strictObject({
        id: z.string().trim().min(1).max(20),
        originLocationCode: locationCode,
        destinationLocationCode: locationCode,
        departureDateTimeRange: z.strictObject({ date: dateString }),
      })
    )
    .length(1),
  travelers: z
    .array(
      z.strictObject({
        id: z.string().trim().min(1).max(20),
        travelerType: z.enum(["ADULT"]),
      })
    )
    .min(1)
    .max(9),
  sources: z.array(z.enum(["GDS"])).length(1),
  searchCriteria: z.strictObject({
    maxFlightOffers: z.number().int().min(1).max(50),
  }),
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
