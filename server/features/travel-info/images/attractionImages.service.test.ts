import type { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../../../config.js";
import type { Attraction } from "../travelInfo.types.js";
import { createAttractionImageService } from "./attractionImages.service.js";

const attraction: Attraction = {
  attractionName: "City Museum",
  description: "Local history museum",
  location: "Old Town",
  entryFee: "$10",
  ratings: "4.5",
  imageUrl: "",
};

describe("attraction image service", () => {
  it("uses Google Custom Search when it returns an image", async () => {
    const get = vi.fn().mockResolvedValue({
      data: {
        items: [
          {
            link: "https://images.example/museum.jpg",
            image: { contextLink: "https://example.com/museum" },
          },
        ],
      },
    });
    const service = createAttractionImageService(
      loadConfig({
        GOOGLE_SEARCH_API_KEY: "search-key",
        GOOGLE_SEARCH_ENGINE_ID: "search-engine",
      }),
      { get } as unknown as AxiosInstance
    );

    await expect(service.enrich([attraction])).resolves.toEqual([
      expect.objectContaining({
        imageUrl: "https://images.example/museum.jpg",
        imageSourceName: "Web source",
        imageSourceUrl: "https://example.com/museum",
      }),
    ]);
    expect(get).toHaveBeenCalledTimes(1);
  });

  it("falls back to Wikipedia when Google image search fails", async () => {
    const get = vi
      .fn()
      .mockRejectedValueOnce(new Error("Google unavailable"))
      .mockResolvedValueOnce({
        data: {
          query: {
            pages: [
              {
                title: "City Museum",
                thumbnail: { source: "https://wikipedia.example/museum.jpg" },
              },
            ],
          },
        },
      });
    const service = createAttractionImageService(
      loadConfig({
        GOOGLE_SEARCH_API_KEY: "search-key",
        GOOGLE_SEARCH_ENGINE_ID: "search-engine",
      }),
      { get } as unknown as AxiosInstance
    );

    await expect(service.enrich([attraction])).resolves.toEqual([
      expect.objectContaining({
        imageUrl: "https://wikipedia.example/museum.jpg",
        imageSourceName: "Wikipedia",
        imageSourceUrl: "https://en.wikipedia.org/wiki/City_Museum",
      }),
    ]);
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("preserves travel results when optional image lookup fails", async () => {
    const get = vi.fn().mockRejectedValue(new Error("Wikipedia unavailable"));
    const service = createAttractionImageService(
      loadConfig({}),
      { get } as unknown as AxiosInstance
    );

    await expect(service.enrich([attraction])).resolves.toEqual([
      { ...attraction, imageUrl: "" },
    ]);
  });
});
