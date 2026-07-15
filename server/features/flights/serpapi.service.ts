import axios, { type AxiosInstance } from "axios";
import { requireSecret, type ServerConfig } from "../../config.js";
import type {
  FlightResult,
  FlightSearchPayload,
  FlightService,
} from "./flights.types.js";
import { ProviderError, providerError } from "../../shared/errors.js";
import { normalizeSerpApiFlights } from "./serpapi.mapper.js";
import type { SerpApiResponse } from "./serpapi.types.js";

interface CacheEntry {
  expiresAt: number;
  value: FlightResult[];
}

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
