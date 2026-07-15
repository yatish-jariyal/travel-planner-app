import { Router } from "express";
import type { AirportSearchResponse } from "../../../shared/api/contracts.js";
import { airportQuerySchema } from "./airports.schema.js";
import type { AirportService } from "./airports.types.js";

export const createAirportsRouter = (service: AirportService) => {
  const router = Router();

  router.get("/", async (request, response, next) => {
    try {
      const { keyword } = airportQuerySchema.parse(request.query);
      const body: AirportSearchResponse = {
        data: await service.search(keyword),
      };
      response.json(body);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
