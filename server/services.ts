import axios from "axios";
import type { ServerConfig } from "./config.js";
import type { Services } from "./contracts.js";
import { createAirportService } from "./providers/airports.js";
import { createSerpApiFlightService } from "./providers/serpapi.js";
import { createTravelService } from "./providers/travel.js";

export const createServices = (config: ServerConfig): Services => {
  const providerClient = axios.create({ timeout: config.providerTimeoutMs });
  return {
    airports: createAirportService(),
    flights: createSerpApiFlightService(config, providerClient),
    travel: createTravelService(config, providerClient),
  };
};
