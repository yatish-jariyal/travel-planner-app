import { describe, expect, it } from "vitest";
import { ProviderError } from "../errors.js";
import { geminiProviderError, parseTravelDataResponse } from "./travel.js";

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

describe("geminiProviderError", () => {
  it("preserves Gemini deadline failures as gateway timeouts", () => {
    const error = geminiProviderError({
      status: 504,
      message: "DEADLINE_EXCEEDED: private provider details",
    });

    expect(error).toMatchObject({
      message: "Gemini timed out.",
      provider: "Gemini",
      status: 504,
    });
  });

  it("distinguishes depleted prepaid credits from a temporary quota limit", () => {
    const error = geminiProviderError({
      status: 429,
      message: "Your prepayment credits are depleted. Project 123.",
    });

    expect(error).toMatchObject({
      message: "Gemini prepaid billing credits are depleted.",
      provider: "Gemini",
      status: 429,
    });
    expect(error.message).not.toContain("123");
  });

  it("identifies API-key service restrictions", () => {
    const error = geminiProviderError({
      status: 403,
      message: "PERMISSION_DENIED: API_KEY_SERVICE_BLOCKED for project 123",
    });

    expect(error).toMatchObject({
      message: "Gemini API access is blocked by this API key's restrictions.",
      provider: "Gemini",
      status: 503,
    });
    expect(error.message).not.toContain("123");
  });

  it("identifies a disabled Gemini API without exposing provider details", () => {
    const error = geminiProviderError({
      status: 403,
      message:
        "SERVICE_DISABLED: Gemini API has not been used in project 123 before or it is disabled.",
    });

    expect(error).toMatchObject({
      message: "Gemini API is disabled for this Google Cloud project.",
      provider: "Gemini",
      status: 503,
    });
    expect(error.message).not.toContain("123");
  });
});
