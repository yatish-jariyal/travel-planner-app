import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import type { ServerConfig } from "./config.js";
import { createAirportsRouter } from "./features/airports/airports.routes.js";
import { createFlightsRouter } from "./features/flights/flights.routes.js";
import { createTravelInfoRouter } from "./features/travel-info/travelInfo.routes.js";
import type { Services } from "./services.js";
import { CorsOriginError, errorHandler } from "./shared/errors.js";

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

  app.use("/api/airports", createAirportsRouter(services.airports));
  app.use("/api/flights", createFlightsRouter(services.flights));
  app.use("/api/travel-info", createTravelInfoRouter(services.travel));

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "NOT_FOUND", message: "The requested route was not found." },
    });
  });
  app.use(errorHandler);

  return app;
};
