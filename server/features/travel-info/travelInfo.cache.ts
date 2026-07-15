import type {
  TravelInfoRequest,
  TravelInfoResult,
} from "../../../shared/api/contracts.js";
import type { TravelService } from "./travelInfo.types.js";

export interface TravelInfoCacheOptions {
  ttlMs: number;
  maxEntries: number;
}

interface CacheEntry {
  expiresAt: number;
  value: TravelInfoResult;
}

export const createTravelInfoCacheKey = ({
  destinationCity,
  startDate,
  endDate,
}: TravelInfoRequest) =>
  JSON.stringify({
    destinationCity: destinationCity
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("en-US"),
    startDate,
    endDate,
  });

export const createCachedTravelInfoService = (
  service: TravelService,
  options: TravelInfoCacheOptions,
  now: () => number = Date.now
): TravelService => {
  const cache = new Map<string, CacheEntry>();
  const inFlight = new Map<string, Promise<TravelInfoResult>>();

  const removeExpiredEntries = (currentTime: number) => {
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= currentTime) cache.delete(key);
    }
  };

  const cacheResult = (key: string, value: TravelInfoResult) => {
    const currentTime = now();
    removeExpiredEntries(currentTime);

    while (cache.size >= options.maxEntries) {
      const leastRecentlyUsedKey = cache.keys().next().value;
      if (!leastRecentlyUsedKey) break;
      cache.delete(leastRecentlyUsedKey);
    }

    cache.set(key, {
      expiresAt: currentTime + options.ttlMs,
      value,
    });
  };

  return {
    async getTravelInfo(input) {
      const key = createTravelInfoCacheKey(input);
      const currentTime = now();
      const cached = cache.get(key);

      if (cached && cached.expiresAt > currentTime) {
        cache.delete(key);
        cache.set(key, cached);
        return cached.value;
      }

      if (cached) cache.delete(key);

      const pending = inFlight.get(key);
      if (pending) return pending;

      const request = Promise.resolve()
        .then(() => service.getTravelInfo(input))
        .then((result) => {
          cacheResult(key, result);
          return result;
        })
        .finally(() => {
          inFlight.delete(key);
        });

      inFlight.set(key, request);
      return request;
    },
  };
};
