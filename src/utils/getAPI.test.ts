import { describe, expect, it, vi } from "vitest";
import type { TravelDataResponse } from "../redux/travelSlice";
import {
  enrichAttractionImages,
  parseTravelDataResponse,
} from "./getAPI";

const completeHotel = {
  hotelName: "Harbour Hotel",
  stars: "4",
  availability: "Available",
  price: "$200",
  description: "Near the harbour",
  location: "Waterfront",
  ratings: "4.6",
};

const completeAttraction = {
  attractionName: "City Museum",
  description: "Local history museum",
  location: "Old Town",
  entryFee: "$10",
  ratings: "4.5",
  imageUrl: "https://example.com/original.jpg",
};

describe("parseTravelDataResponse", () => {
  it("parses a plain JSON response", () => {
    const result = parseTravelDataResponse(
      JSON.stringify({
        hotels: [completeHotel],
        attractions: [completeAttraction],
      })
    );

    expect(result).toEqual({
      hotels: [completeHotel],
      attractions: [completeAttraction],
    });
  });

  it("parses JSON inside a Markdown fence with surrounding whitespace", () => {
    const result = parseTravelDataResponse(`
      \`\`\`json
      {"hotels": [{"hotelName": "Central Hotel"}], "attractions": []}
      \`\`\`
    `);

    expect(result.hotels).toEqual([
      {
        hotelName: "Central Hotel",
        stars: "Not available",
        availability: "Not available",
        price: "Not available",
        description: "Not available",
        location: "Not available",
        ratings: "Not available",
      },
    ]);
  });

  it("defaults missing collections and filters invalid entries", () => {
    const result = parseTravelDataResponse(
      JSON.stringify({ hotels: [null, {}, completeHotel] })
    );

    expect(result.hotels).toEqual([completeHotel]);
    expect(result.attractions).toEqual([]);
  });

  it("normalizes numeric values returned for string fields", () => {
    const result = parseTravelDataResponse(
      JSON.stringify({
        hotels: [{ hotelName: "Central Hotel", stars: 5, ratings: 4.8 }],
      })
    );

    expect(result.hotels[0]).toEqual(
      expect.objectContaining({ stars: "5", ratings: "4.8" })
    );
  });

  it("rejects malformed JSON and non-object roots", () => {
    expect(() => parseTravelDataResponse("not JSON")).toThrow(
      "The AI returned invalid JSON."
    );
    expect(() => parseTravelDataResponse("[]")).toThrow(
      "The AI response has an invalid structure."
    );
  });
});

describe("enrichAttractionImages", () => {
  const travelData: TravelDataResponse = {
    hotels: [completeHotel],
    attractions: [completeAttraction],
  };
  const config = { apiKey: "test-key", searchEngineId: "test-engine" };

  it("uses the first image-search result", async () => {
    const get = vi.fn().mockResolvedValue({
      data: { items: [{ link: "https://example.com/search-result.jpg" }] },
    });

    const result = await enrichAttractionImages(travelData, config, { get });

    expect(result.attractions[0].imageUrl).toBe(
      "https://example.com/search-result.jpg"
    );
    expect(get).toHaveBeenCalledWith(
      "https://www.googleapis.com/customsearch/v1",
      expect.objectContaining({
        params: expect.objectContaining({
          q: "City Museum Old Town",
          cx: "test-engine",
          searchType: "image",
          key: "test-key",
        }),
      })
    );
  });

  it("preserves the original attraction when search has no result", async () => {
    const get = vi.fn().mockResolvedValue({ data: {} });

    await expect(
      enrichAttractionImages(travelData, config, { get })
    ).resolves.toEqual(travelData);
  });

  it("preserves the original attraction when image search fails", async () => {
    const get = vi.fn().mockRejectedValue(new Error("Search unavailable"));

    await expect(
      enrichAttractionImages(travelData, config, { get })
    ).resolves.toEqual(travelData);
  });

  it("skips image search when optional configuration is absent", async () => {
    const get = vi.fn();

    await expect(
      enrichAttractionImages(
        travelData,
        { apiKey: "", searchEngineId: "" },
        { get }
      )
    ).resolves.toBe(travelData);
    expect(get).not.toHaveBeenCalled();
  });
});
