import { describe, expect, it } from "vitest";
import { ProviderError } from "../errors.js";
import { parseTravelDataResponse } from "./travel.js";

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
  it("parses complete JSON travel data", () => {
    expect(
      parseTravelDataResponse(
        JSON.stringify({
          hotels: [completeHotel],
          attractions: [completeAttraction],
        })
      )
    ).toEqual({ hotels: [completeHotel], attractions: [completeAttraction] });
  });

  it("normalizes incomplete and numeric fields", () => {
    const result = parseTravelDataResponse(
      JSON.stringify({
        hotels: [{ hotelName: "Central Hotel", stars: 5, ratings: 4.8 }],
        attractions: [null, {}],
      })
    );

    expect(result.hotels[0]).toEqual({
      hotelName: "Central Hotel",
      stars: "5",
      availability: "Not available",
      price: "Not available",
      description: "Not available",
      location: "Not available",
      ratings: "4.8",
    });
    expect(result.attractions).toEqual([]);
  });

  it("accepts a defensive Markdown fence", () => {
    const result = parseTravelDataResponse(
      '```json\n{"hotels":[],"attractions":[]}\n```'
    );
    expect(result).toEqual({ hotels: [], attractions: [] });
  });

  it("rejects malformed provider data", () => {
    expect(() => parseTravelDataResponse("not json")).toThrow(ProviderError);
    expect(() => parseTravelDataResponse("[]")).toThrow(ProviderError);
  });
});
