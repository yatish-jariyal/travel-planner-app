import { Router } from "express";
import { travelInfoSchema } from "./travelInfo.schema.js";
import type { TravelService } from "./travelInfo.types.js";

export const createTravelInfoRouter = (service: TravelService) => {
  const router = Router();

  router.post("/", async (request, response, next) => {
    try {
      const input = travelInfoSchema.parse(request.body);
      response.json({ data: await service.getTravelInfo(input) });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
