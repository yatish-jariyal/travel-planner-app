import { Router } from "express";
import { airportQuerySchema } from "./airports.schema.js";
import type { AirportService } from "./airports.types.js";

export const createAirportsRouter = (service: AirportService) => {
  const router = Router();

  router.get("/", async (request, response, next) => {
    try {
      const { keyword } = airportQuerySchema.parse(request.query);
      response.json({ data: await service.search(keyword) });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
