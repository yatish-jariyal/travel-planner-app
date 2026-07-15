import type { FlightResult } from "./flights.types.js";
import type { SerpApiResponse } from "./serpapi.types.js";

const normalizeTime = (value: string | undefined) =>
  value?.replace(" ", "T") ?? "";

export const normalizeSerpApiFlights = (
  response: SerpApiResponse,
  currency: string
): FlightResult[] => {
  const groups = [
    ...(response.best_flights ?? []),
    ...(response.other_flights ?? []),
  ];

  return groups.flatMap((group, index) => {
    const segments = group.flights ?? [];
    const first = segments[0];
    const last = segments.at(-1);

    if (
      !first?.departure_airport?.id ||
      !first.departure_airport.time ||
      !last?.arrival_airport?.id ||
      !last.arrival_airport.time ||
      typeof group.price !== "number"
    ) {
      return [];
    }

    const flightNumbers = segments
      .map((segment) => segment.flight_number?.trim())
      .filter((value): value is string => Boolean(value));
    const airlines = [
      ...new Set(
        segments
          .map((segment) => segment.airline?.trim())
          .filter((value): value is string => Boolean(value))
      ),
    ];

    return [
      {
        id: `${first.departure_airport.id}-${last.arrival_airport.id}-${normalizeTime(first.departure_airport.time)}-${index}`,
        airline: airlines.join(", ") || "Airline unavailable",
        airlineLogo: group.airline_logo || first.airline_logo || "",
        flightNumber: flightNumbers.join(" · ") || "Flight number unavailable",
        departure: {
          airportCode: first.departure_airport.id,
          airportName: first.departure_airport.name ?? "",
          at: normalizeTime(first.departure_airport.time),
        },
        arrival: {
          airportCode: last.arrival_airport.id,
          airportName: last.arrival_airport.name ?? "",
          at: normalizeTime(last.arrival_airport.time),
        },
        durationMinutes:
          group.total_duration ??
          segments.reduce(
            (total, segment) => total + (segment.duration ?? 0),
            0
          ),
        stops: Math.max(segments.length - 1, 0),
        price: { currency, amount: group.price },
        travelClass: first.travel_class || "Economy",
        tripType: group.type || "Round trip",
      },
    ];
  });
};
