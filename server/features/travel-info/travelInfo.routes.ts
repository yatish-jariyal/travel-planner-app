import { Router } from "express";
import type { TravelInfoResponse } from "../../../shared/api/contracts.js";
import { travelInfoSchema } from "./travelInfo.schema.js";
import type { TravelService } from "./travelInfo.types.js";

export const createTravelInfoRouter = (service: TravelService) => {
  const router = Router();

  router.post("/", async (request, response, next) => {
    try {
      const input = travelInfoSchema.parse(request.body);
      const body: TravelInfoResponse = {
        data: await service.getTravelInfo(input),
      };
      response.json(body);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
