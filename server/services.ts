import axios from "axios";
import type { ServerConfig } from "./config.js";
import type { Services } from "./contracts.js";
import { createAmadeusServices } from "./providers/amadeus.js";
import { createTravelService } from "./providers/travel.js";

export const createServices = (config: ServerConfig): Services => {
  const providerClient = axios.create({ timeout: config.providerTimeoutMs });
  const amadeus = createAmadeusServices(config, providerClient);

  return {
    ...amadeus,
    travel: createTravelService(config, providerClient),
  };
};
