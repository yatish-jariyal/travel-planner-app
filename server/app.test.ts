import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import type { Services } from "./contracts.js";
import { ProviderError } from "./errors.js";

const createMockServices = (): Services => ({
  airports: { search: vi.fn().mockResolvedValue([{ iataCode: "DEL" }]) },
  flights: { search: vi.fn().mockResolvedValue([{ id: "flight-1" }]) },
  travel: {
    getTravelInfo: vi.fn().mockResolvedValue({ hotels: [], attractions: [] }),
  },
});

const validFlightRequest = {
  currencyCode: "INR",
  originDestinations: [
    {
      id: "1",
      originLocationCode: "DEL",
      destinationLocationCode: "BOM",
      departureDateTimeRange: { date: "2026-08-01" },
    },
  ],
  travelers: [{ id: "1", travelerType: "ADULT" }],
  sources: ["GDS"],
  searchCriteria: { maxFlightOffers: 20 },
};

describe("API", () => {
  it("reports health without provider credentials", async () => {
    const response = await request(
      createApp(createMockServices(), loadConfig({}))
    ).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("validates and forwards airport searches", async () => {
    const services = createMockServices();
    const response = await request(createApp(services, loadConfig({})))
      .get("/api/airports")
      .query({ keyword: "Delhi" });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ iataCode: "DEL" }]);
    expect(services.airports.search).toHaveBeenCalledWith("Delhi");
  });

  it("rejects an unapproved browser origin", async () => {
    const response = await request(
      createApp(createMockServices(), loadConfig({}))
    )
      .get("/api/health")
      .set("Origin", "https://unapproved.example");

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("ORIGIN_NOT_ALLOWED");
  });

  it("rejects short airport queries", async () => {
    const response = await request(
      createApp(createMockServices(), loadConfig({}))
    ).get("/api/airports?keyword=D");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
  });

  it("rejects unexpected flight fields", async () => {
    const response = await request(
      createApp(createMockServices(), loadConfig({}))
    )
      .post("/api/flights/search")
      .send({ ...validFlightRequest, clientSecret: "must-not-be-accepted" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
  });

  it("forwards a valid flight request", async () => {
    const services = createMockServices();
    const response = await request(createApp(services, loadConfig({})))
      .post("/api/flights/search")
      .send(validFlightRequest);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([{ id: "flight-1" }]);
    expect(services.flights.search).toHaveBeenCalledWith(validFlightRequest);
  });

  it("rejects a travel date range ending before it starts", async () => {
    const response = await request(
      createApp(createMockServices(), loadConfig({}))
    )
      .post("/api/travel-info")
      .send({
        destinationCity: "Mumbai",
        startDate: "2026-08-02",
        endDate: "2026-08-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error.fields).toContain("endDate");
  });

  it("returns sanitized provider failures", async () => {
    const services = createMockServices();
    services.travel.getTravelInfo = vi
      .fn()
      .mockRejectedValue(new ProviderError("Gemini timed out.", "Gemini", 504));

    const response = await request(createApp(services, loadConfig({})))
      .post("/api/travel-info")
      .send({
        destinationCity: "Mumbai",
        startDate: "2026-08-01",
        endDate: "2026-08-02",
      });

    expect(response.status).toBe(504);
    expect(response.body).toEqual({
      error: { code: "PROVIDER_ERROR", message: "Gemini timed out." },
    });
  });
});
