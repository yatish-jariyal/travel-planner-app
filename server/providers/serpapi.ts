import axios, { type AxiosInstance } from "axios";
import { requireSecret, type ServerConfig } from "../config.js";
import type {
  FlightResult,
  FlightSearchPayload,
  FlightService,
} from "../contracts.js";
import { ProviderError, providerError } from "../errors.js";

interface SerpAirport {
  id?: string;
  name?: string;
  time?: string;
}

interface SerpFlightSegment {
  departure_airport?: SerpAirport;
  arrival_airport?: SerpAirport;
  duration?: number;
  airline?: string;
  airline_logo?: string;
  flight_number?: string;
  travel_class?: string;
}

interface SerpFlightGroup {
  flights?: SerpFlightSegment[];
  total_duration?: number;
  price?: number;
  type?: string;
  airline_logo?: string;
}

interface SerpApiResponse {
  best_flights?: SerpFlightGroup[];
  other_flights?: SerpFlightGroup[];
  error?: string;
  search_metadata?: {
    status?: string;
  };
}

interface CacheEntry {
  expiresAt: number;
  value: FlightResult[];
}

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
          segments.reduce((total, segment) => total + (segment.duration ?? 0), 0),
        stops: Math.max(segments.length - 1, 0),
        price: { currency, amount: group.price },
        travelClass: first.travel_class || "Economy",
        tripType: group.type || "Round trip",
      },
    ];
  });
};

export const createSerpApiFlightService = (
  config: ServerConfig,
  client: AxiosInstance = axios.create({ timeout: config.providerTimeoutMs }),
  now: () => number = Date.now
): FlightService => {
  const cache = new Map<string, CacheEntry>();

  return {
    async search(payload: FlightSearchPayload) {
      const cacheKey = JSON.stringify(payload);
      const cached = cache.get(cacheKey);
      if (cached && cached.expiresAt > now()) {
        return cached.value;
      }

      const apiKey = requireSecret(
        "SERPAPI_API_KEY",
        config.flightSearch.apiKey
      );

      try {
        const response = await client.get<SerpApiResponse>(
          config.flightSearch.apiBaseUrl,
          {
            params: {
              engine: "google_flights",
              departure_id: payload.originCode,
              arrival_id: payload.destinationCode,
              outbound_date: payload.departureDate,
              return_date: payload.returnDate,
              type: "1",
              currency: config.flightSearch.currency,
              gl: config.flightSearch.country,
              hl: config.flightSearch.language,
              api_key: apiKey,
            },
          }
        );

        // SerpApi can return HTTP 200 with an `error` string when Google
        // completed the search successfully but found no matching flights.
        // That is an empty result, not a provider outage.
        if (
          response.data.error &&
          response.data.search_metadata?.status !== "Success"
        ) {
          throw new ProviderError(
            "Flight search is currently unavailable.",
            "SerpApi"
          );
        }

        const flights = normalizeSerpApiFlights(
          response.data,
          config.flightSearch.currency
        );

        if (cache.size >= 100) {
          const oldestKey = cache.keys().next().value;
          if (oldestKey) cache.delete(oldestKey);
        }
        cache.set(cacheKey, {
          expiresAt: now() + config.flightSearch.cacheTtlMs,
          value: flights,
        });

        return flights;
      } catch (error) {
        throw providerError("SerpApi flight search", error);
      }
    },
  };
};
