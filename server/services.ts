import axios from "axios";
import type { ServerConfig } from "./config.js";
import { createAirportService } from "./features/airports/airports.service.js";
import type { AirportService } from "./features/airports/airports.types.js";
import { createSerpApiFlightService } from "./features/flights/serpapi.service.js";
import type { FlightService } from "./features/flights/flights.types.js";
import { createGeminiTravelGenerator } from "./features/travel-info/gemini/gemini.client.js";
import { createAttractionImageService } from "./features/travel-info/images/attractionImages.service.js";
import { createTravelInfoService } from "./features/travel-info/travelInfo.service.js";
import type { TravelService } from "./features/travel-info/travelInfo.types.js";

export interface Services {
  airports: AirportService;
  flights: FlightService;
  travel: TravelService;
}

export const createServices = (config: ServerConfig): Services => {
  const providerClient = axios.create({ timeout: config.providerTimeoutMs });
  const travelGenerator = createGeminiTravelGenerator(config);
  const attractionImages = createAttractionImageService(config, providerClient);

  return {
    airports: createAirportService(),
    flights: createSerpApiFlightService(config, providerClient),
    travel: createTravelInfoService(travelGenerator, attractionImages),
  };
};
