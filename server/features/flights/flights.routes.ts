import { Router } from "express";
import { flightSearchSchema } from "./flights.schema.js";
import type { FlightService } from "./flights.types.js";

export const createFlightsRouter = (service: FlightService) => {
  const router = Router();

  router.post("/search", async (request, response, next) => {
    try {
      const payload = flightSearchSchema.parse(request.body);
      response.json({ data: await service.search(payload) });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
