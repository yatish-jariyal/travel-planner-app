import { describe, expect, it } from "vitest";
import { createAirportService, type AirportRecord } from "./airports.service.js";

const airports: AirportRecord[] = [
  {
    id: "1",
    iataCode: "DEL",
    name: "Indira Gandhi International Airport",
    cityName: "Delhi",
    countryCode: "IN",
    countryName: "India",
  },
  {
    id: "2",
    iataCode: "BOM",
    name: "Chhatrapati Shivaji International Airport",
    cityName: "Mumbai",
    countryCode: "IN",
    countryName: "India",
  },
  {
    id: "3",
    iataCode: "DLE",
    name: "Dole–Jura Airport",
    cityName: "Dole",
    countryCode: "FR",
    countryName: "France",
  },
  {
    id: "4",
    iataCode: "CDG",
    name: "Charles de Gaulle International Airport",
    cityName: "Paris (Roissy-en-France)",
    countryCode: "FR",
    countryName: "France",
  },
  {
    id: "5",
    iataCode: "ORY",
    name: "Paris-Orly Airport",
    cityName: "Paris (Orly)",
    countryCode: "FR",
    countryName: "France",
  },
];

describe("airport search", () => {
  it("prioritizes exact IATA matches", async () => {
    const results = await createAirportService(airports).search("DEL");
    expect(results[0]?.iataCode).toBe("DEL");
  });

  it("searches city, airport, and country text", async () => {
    const service = createAirportService(airports);

    await expect(service.search("mumbai")).resolves.toEqual([
      expect.objectContaining({ iataCode: "BOM" }),
    ]);
    await expect(service.search("dole")).resolves.toEqual([
      expect.objectContaining({ iataCode: "DLE" }),
    ]);
  });

  it("offers a canonical all-airports result for metro searches", async () => {
    const results = await createAirportService(airports).search("paris");

    expect(results[0]).toEqual(
      expect.objectContaining({
        name: "Paris — all airports",
        flightSearchCode: "CDG,ORY",
        address: expect.objectContaining({ cityName: "Paris" }),
      })
    );
    expect(results.find((result) => result.iataCode === "CDG")).toEqual(
      expect.objectContaining({
        iataCode: "CDG",
        address: expect.objectContaining({ cityName: "Paris" }),
      })
    );
  });
});
