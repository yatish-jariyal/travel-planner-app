import { readFileSync } from "node:fs";
import type { AirportResult, AirportService } from "../contracts.js";

export interface AirportRecord {
  id: string;
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  countryName: string;
}

const airportData = JSON.parse(
  readFileSync(new URL("../../data/airports.json", import.meta.url), "utf8")
) as AirportRecord[];

const searchableText = (airport: AirportRecord) =>
  `${airport.iataCode} ${airport.name} ${airport.cityName} ${airport.countryName}`.toLowerCase();

const canonicalCityName = (cityName: string) =>
  cityName.replace(/\s+\([^)]*\).*$/, "").trim();

const rankAirport = (airport: AirportRecord, query: string) => {
  const iataCode = airport.iataCode.toLowerCase();
  const cityName = airport.cityName.toLowerCase();
  const name = airport.name.toLowerCase();

  if (iataCode === query) return 0;
  if (iataCode.startsWith(query)) return 1;
  if (cityName.startsWith(query)) return 2;
  if (name.startsWith(query)) return 3;
  if (cityName.includes(query)) return 4;
  if (name.includes(query)) return 5;
  return 6;
};

const toAirportResult = (airport: AirportRecord): AirportResult => ({
  id: airport.id,
  iataCode: airport.iataCode,
  name: airport.name,
  address: {
    cityName: canonicalCityName(airport.cityName),
    countryName: airport.countryName,
    countryCode: airport.countryCode,
  },
});

const metroResults = (airports: AirportRecord[], query: string) => {
  const groups = new Map<string, AirportRecord[]>();

  for (const airport of airports) {
    const cityName = canonicalCityName(airport.cityName);
    if (!cityName.toLowerCase().startsWith(query)) continue;

    const key = `${airport.countryCode}:${cityName.toLowerCase()}`;
    const group = groups.get(key) ?? [];
    group.push(airport);
    groups.set(key, group);
  }

  return [...groups.values()]
    .filter((group) => group.length > 1)
    .sort((left, right) => {
      const leftCity = canonicalCityName(left[0].cityName).toLowerCase();
      const rightCity = canonicalCityName(right[0].cityName).toLowerCase();
      const leftRank = leftCity === query ? 0 : 1;
      const rightRank = rightCity === query ? 0 : 1;
      return leftRank - rightRank || leftCity.localeCompare(rightCity);
    })
    .map((group): AirportResult => {
      const [first] = group;
      const cityName = canonicalCityName(first.cityName);
      const airportCodes = group.map((airport) => airport.iataCode);

      return {
        id: `metro:${first.countryCode}:${cityName.toLowerCase()}`,
        iataCode: first.iataCode,
        flightSearchCode: airportCodes.join(","),
        name: `${cityName} — all airports`,
        address: {
          cityName,
          countryName: first.countryName,
          countryCode: first.countryCode,
        },
      };
    });
};

export const createAirportService = (
  airports: AirportRecord[] = airportData
): AirportService => ({
  async search(keyword) {
    const query = keyword.trim().toLowerCase();
    const matches = airports
      .filter((airport) => searchableText(airport).includes(query))
      .sort((left, right) => {
        const rankDifference =
          rankAirport(left, query) - rankAirport(right, query);
        return rankDifference || left.cityName.localeCompare(right.cityName);
      })
      .map(toAirportResult);

    return [...metroResults(airports, query), ...matches].slice(0, 10);
  },
});
