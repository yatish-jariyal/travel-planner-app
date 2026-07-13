import type { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../config.js";
import { createAmadeusServices } from "./amadeus.js";

describe("Amadeus services", () => {
  it("caches provider tokens server-side and never returns them", async () => {
    const post = vi.fn().mockResolvedValue({
      data: { access_token: "server-token", expires_in: 1_800 },
    });
    const get = vi
      .fn()
      .mockResolvedValueOnce({ data: { data: [{ iataCode: "DEL" }] } })
      .mockResolvedValueOnce({ data: { data: [{ iataCode: "BOM" }] } });
    const client = { post, get } as unknown as AxiosInstance;
    const config = loadConfig({
      AMADEUS_CLIENT_ID: "client-id",
      AMADEUS_CLIENT_SECRET: "client-secret",
    });
    const services = createAmadeusServices(config, client);

    await expect(services.airports.search("Delhi")).resolves.toEqual([
      { iataCode: "DEL" },
    ]);
    await expect(services.airports.search("Mumbai")).resolves.toEqual([
      { iataCode: "BOM" },
    ]);

    expect(post).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(2);
    expect(get).toHaveBeenCalledWith(
      expect.stringContaining("/v1/reference-data/locations"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer server-token",
        }),
      })
    );
  });
});
