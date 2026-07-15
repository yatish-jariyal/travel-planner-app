import { describe, expect, it } from "vitest";
import type { AirportResult } from "../../../shared/api/contracts";
import { validateTravelForm } from "./tripSearch.validation";

const createLocation = (iataCode: string): AirportResult => ({
  name: iataCode,
  id: iataCode,
  iataCode,
  address: {
    cityName: iataCode,
    countryName: "Test Country",
    countryCode: "TC",
  },
});

describe("validateTravelForm", () => {
  const validValues = {
    originCity: createLocation("DEL"),
    destinationCity: createLocation("BOM"),
    startDate: "2026-08-01",
    endDate: "2026-08-05",
  };

  it("accepts a valid trip", () => {
    expect(validateTravelForm(validValues)).toEqual([]);
  });

  it("requires cities to be selected from suggestions", () => {
    expect(
      validateTravelForm({
        ...validValues,
        originCity: null,
        destinationCity: null,
      })
    ).toEqual([
      "Select an origin from the search suggestions.",
      "Select a destination from the search suggestions.",
    ]);
  });

  it("rejects matching origin and destination airports", () => {
    expect(
      validateTravelForm({
        ...validValues,
        destinationCity: createLocation("DEL"),
      })
    ).toContain("Origin and destination must be different.");
  });

  it("rejects a return date before the departure date", () => {
    expect(
      validateTravelForm({
        ...validValues,
        endDate: "2026-07-31",
      })
    ).toContain("Return date cannot be before the departure date.");
  });

  it("rejects invalid date values", () => {
    expect(
      validateTravelForm({ ...validValues, startDate: "not-a-date" })
    ).toContain("Select valid departure and return dates.");
  });
});
