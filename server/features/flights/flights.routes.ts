import { Router } from "express";
import type { FlightSearchResponse } from "../../../shared/api/contracts.js";
import { flightSearchSchema } from "./flights.schema.js";
import type { FlightService } from "./flights.types.js";

export const createFlightsRouter = (service: FlightService) => {
  const router = Router();

  router.post("/search", async (request, response, next) => {
    try {
      const payload = flightSearchSchema.parse(request.body);
      const body: FlightSearchResponse = {
        data: await service.search(payload),
      };
      response.json(body);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
