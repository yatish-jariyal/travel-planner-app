import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import type { ServerConfig } from "./config.js";
import type { Services } from "./contracts.js";
import { CorsOriginError, errorHandler } from "./errors.js";
import {
  airportQuerySchema,
  flightSearchSchema,
  travelInfoSchema,
} from "./schemas.js";

export const createApp = (services: Services, config: ServerConfig) => {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.frontendOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new CorsOriginError("Origin is not allowed."));
      },
      methods: ["GET", "POST"],
    })
  );
  app.use(express.json({ limit: "16kb", strict: true }));
  app.use(
    "/api",
    rateLimit({
      windowMs: 60_000,
      limit: 60,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    })
  );

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.get("/api/airports", async (request, response, next) => {
    try {
      const { keyword } = airportQuerySchema.parse(request.query);
      response.json({ data: await services.airports.search(keyword) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/flights/search", async (request, response, next) => {
    try {
      const payload = flightSearchSchema.parse(request.body);
      response.json({ data: await services.flights.search(payload) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/travel-info", async (request, response, next) => {
    try {
      const input = travelInfoSchema.parse(request.body);
      response.json({ data: await services.travel.getTravelInfo(input) });
    } catch (error) {
      next(error);
    }
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "NOT_FOUND", message: "The requested route was not found." },
    });
  });
  app.use(errorHandler);

  return app;
};
