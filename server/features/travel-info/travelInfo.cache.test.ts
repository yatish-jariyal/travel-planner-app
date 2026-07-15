import { describe, expect, it, vi } from "vitest";
import type {
  TravelInfoRequest,
  TravelInfoResult,
} from "../../../shared/api/contracts.js";
import {
  createCachedTravelInfoService,
  createTravelInfoCacheKey,
} from "./travelInfo.cache.js";
import type { TravelService } from "./travelInfo.types.js";

const input: TravelInfoRequest = {
  destinationCity: "Sydney",
  startDate: "2026-08-01",
  endDate: "2026-08-03",
};

const result: TravelInfoResult = {
  hotels: [
    {
      hotelName: "Harbour Hotel",
      stars: "4",
      availability: "Available",
      price: "$200",
      description: "Near the harbour",
      location: "Waterfront",
      ratings: "4.6",
    },
  ],
  attractions: [
    {
      attractionName: "City Museum",
      description: "Local history museum",
      location: "Old Town",
      entryFee: "$10",
      ratings: "4.5",
      imageUrl: "https://example.com/museum.jpg",
      imageSourceName: "Wikipedia",
    },
  ],
};

const createBaseService = (getTravelInfo = vi.fn().mockResolvedValue(result)) =>
  ({ getTravelInfo }) as TravelService;

describe("travel information cache", () => {
  it("reuses a successful enriched result for an identical search", async () => {
    const getTravelInfo = vi.fn().mockResolvedValue(result);
    const service = createCachedTravelInfoService(
      createBaseService(getTravelInfo),
      { ttlMs: 1_000, maxEntries: 10 },
      () => 100
    );

    await expect(service.getTravelInfo(input)).resolves.toEqual(result);
    await expect(service.getTravelInfo(input)).resolves.toEqual(result);

    expect(getTravelInfo).toHaveBeenCalledTimes(1);
  });

  it("normalizes destination case and whitespace in cache keys", async () => {
    const normalized = createTravelInfoCacheKey(input);
    const variant = createTravelInfoCacheKey({
      ...input,
      destinationCity: "  SYDNEY   ",
    });

    expect(variant).toBe(normalized);
  });

  it("keeps different date ranges in separate entries", async () => {
    const getTravelInfo = vi.fn().mockResolvedValue(result);
    const service = createCachedTravelInfoService(
      createBaseService(getTravelInfo),
      { ttlMs: 1_000, maxEntries: 10 },
      () => 100
    );

    await service.getTravelInfo(input);
    await service.getTravelInfo({ ...input, endDate: "2026-08-04" });

    expect(getTravelInfo).toHaveBeenCalledTimes(2);
  });

  it("refreshes an entry after its TTL expires", async () => {
    let currentTime = 1_000;
    const getTravelInfo = vi.fn().mockResolvedValue(result);
    const service = createCachedTravelInfoService(
      createBaseService(getTravelInfo),
      { ttlMs: 100, maxEntries: 10 },
      () => currentTime
    );

    await service.getTravelInfo(input);
    currentTime = 1_099;
    await service.getTravelInfo(input);
    currentTime = 1_100;
    await service.getTravelInfo(input);

    expect(getTravelInfo).toHaveBeenCalledTimes(2);
  });

  it("evicts the least recently used entry at the configured limit", async () => {
    const getTravelInfo = vi.fn().mockResolvedValue(result);
    const service = createCachedTravelInfoService(
      createBaseService(getTravelInfo),
      { ttlMs: 1_000, maxEntries: 2 },
      () => 100
    );
    const rome = { ...input, destinationCity: "Rome" };
    const paris = { ...input, destinationCity: "Paris" };

    await service.getTravelInfo(input);
    await service.getTravelInfo(rome);
    await service.getTravelInfo(input);
    await service.getTravelInfo(paris);
    await service.getTravelInfo(rome);

    expect(getTravelInfo).toHaveBeenCalledTimes(4);
  });

  it("coalesces simultaneous identical requests", async () => {
    let resolveRequest!: (value: TravelInfoResult) => void;
    const getTravelInfo = vi.fn(
      () =>
        new Promise<TravelInfoResult>((resolve) => {
          resolveRequest = resolve;
        })
    );
    const service = createCachedTravelInfoService(
      createBaseService(getTravelInfo),
      { ttlMs: 1_000, maxEntries: 10 },
      () => 100
    );

    const first = service.getTravelInfo(input);
    const second = service.getTravelInfo(input);
    await Promise.resolve();

    expect(getTravelInfo).toHaveBeenCalledTimes(1);
    resolveRequest(result);
    await expect(Promise.all([first, second])).resolves.toEqual([result, result]);
  });

  it("does not cache failed requests", async () => {
    const getTravelInfo = vi
      .fn()
      .mockRejectedValueOnce(new Error("provider unavailable"))
      .mockResolvedValueOnce(result);
    const service = createCachedTravelInfoService(
      createBaseService(getTravelInfo),
      { ttlMs: 1_000, maxEntries: 10 },
      () => 100
    );

    await expect(service.getTravelInfo(input)).rejects.toThrow(
      "provider unavailable"
    );
    await expect(service.getTravelInfo(input)).resolves.toEqual(result);

    expect(getTravelInfo).toHaveBeenCalledTimes(2);
  });
});
