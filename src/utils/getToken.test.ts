import { describe, expect, it } from "vitest";
import { getAmadeusConfig } from "./getToken";

describe("getAmadeusConfig", () => {
  it("returns configured Amadeus values", () => {
    expect(
      getAmadeusConfig({
        VITE_AMADEUS_API_BASE_URL: "https://example.com/api/",
        VITE_TOKEN_URL: "https://example.com/token",
        VITE_CLIENT_ID: "client-id",
        VITE_CLIENT_SECRET: "client-secret",
      })
    ).toEqual({
      apiBaseUrl: "https://example.com/api",
      tokenUrl: "https://example.com/token",
      clientId: "client-id",
      clientSecret: "client-secret",
    });
  });

  it("identifies a missing required value", () => {
    expect(() =>
      getAmadeusConfig({
        VITE_AMADEUS_API_BASE_URL: "https://example.com/api",
        VITE_TOKEN_URL: "https://example.com/token",
        VITE_CLIENT_ID: "client-id",
      })
    ).toThrow("Missing required environment variable: VITE_CLIENT_SECRET.");
  });
});
