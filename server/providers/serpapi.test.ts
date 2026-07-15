import type { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../config.js";
import {
  createSerpApiFlightService,
  normalizeSerpApiFlights,
} from "./serpapi.js";

const providerResponse = {
  best_flights: [
    {
      flights: [
        {
          departure_airport: {
            id: "DEL",
            name: "Indira Gandhi International Airport",
            time: "2026-08-01 08:00",
          },
          arrival_airport: {
            id: "BOM",
            name: "Chhatrapati Shivaji International Airport",
            time: "2026-08-01 10:10",
          },
          duration: 130,
          airline: "Example Air",
          flight_number: "EX 123",
          travel_class: "Economy",
        },
      ],
      total_duration: 130,
      price: 8500,
      type: "Round trip",
    },
  ],
};

const search = {
  originCode: "DEL",
  destinationCode: "BOM",
  departureDate: "2026-08-01",
  returnDate: "2026-08-03",
};

describe("SerpApi flight service", () => {
  it("normalizes provider results into the project contract", () => {
    expect(normalizeSerpApiFlights(providerResponse, "INR")).toEqual([
      expect.objectContaining({
        airline: "Example Air",
        flightNumber: "EX 123",
        durationMinutes: 130,
        stops: 0,
        price: { currency: "INR", amount: 8500 },
        departure: expect.objectContaining({
          airportCode: "DEL",
          at: "2026-08-01T08:00",
        }),
        arrival: expect.objectContaining({ airportCode: "BOM" }),
      }),
    ]);
  });

  it("caches identical searches and sends server configuration", async () => {
    const get = vi.fn().mockResolvedValue({ data: providerResponse });
    const client = { get } as unknown as AxiosInstance;
    const config = loadConfig({ SERPAPI_API_KEY: "server-key" });
    const service = createSerpApiFlightService(config, client, () => 1_000);

    await service.search(search);
    await service.search(search);

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(
      "https://serpapi.com/search.json",
      expect.objectContaining({
        params: expect.objectContaining({
          engine: "google_flights",
          departure_id: "DEL",
          arrival_id: "BOM",
          outbound_date: "2026-08-01",
          return_date: "2026-08-03",
          currency: "INR",
          api_key: "server-key",
        }),
      })
    );
  });

  it("returns a sanitized provider failure", async () => {
    const client = {
      get: vi.fn().mockResolvedValue({ data: { error: "private detail" } }),
    } as unknown as AxiosInstance;
    const service = createSerpApiFlightService(
      loadConfig({ SERPAPI_API_KEY: "server-key" }),
      client
    );

    await expect(service.search(search)).rejects.toThrow(
      "Flight search is currently unavailable."
    );
  });

  it("returns an empty result when a successful search finds no flights", async () => {
    const client = {
      get: vi.fn().mockResolvedValue({
        data: {
          search_metadata: { status: "Success" },
          error: "Google hasn't returned any results for this query.",
        },
      }),
    } as unknown as AxiosInstance;
    const service = createSerpApiFlightService(
      loadConfig({ SERPAPI_API_KEY: "server-key" }),
      client
    );

    await expect(service.search(search)).resolves.toEqual([]);
  });
});
