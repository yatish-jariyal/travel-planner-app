import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import type { ApiErrorResponse } from "../../shared/api/contracts.js";
import { ServiceConfigurationError } from "../config.js";
import { writeLog } from "./logger.js";

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly status = 502
  ) {
    super(message);
  }
}

export class CorsOriginError extends Error {}

const sendError = (
  response: Response,
  status: number,
  body: ApiErrorResponse
) => {
  response.status(status).json(body);
};

export const providerError = (provider: string, error: unknown) => {
  if (error instanceof ProviderError || error instanceof ServiceConfigurationError) {
    return error;
  }

  if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
    return new ProviderError(`${provider} timed out.`, provider, 504);
  }

  return new ProviderError(`${provider} is currently unavailable.`, provider);
};

export const errorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  void next;
  if (error instanceof ZodError) {
    sendError(response, 400, {
      error: {
        code: "INVALID_REQUEST",
        message: "The request contains invalid or unexpected fields.",
        fields: error.issues.map((issue) => issue.path.join(".")),
      },
    });
    return;
  }

  if (error instanceof ServiceConfigurationError) {
    writeLog("error", "provider_configuration_missing", {
      path: request.path,
      message: error.message,
    });
    sendError(response, 503, {
      error: { code: "SERVICE_NOT_CONFIGURED", message: error.message },
    });
    return;
  }

  if (error instanceof CorsOriginError) {
    sendError(response, 403, {
      error: { code: "ORIGIN_NOT_ALLOWED", message: "Origin is not allowed." },
    });
    return;
  }

  if (error instanceof ProviderError) {
    writeLog("error", "provider_request_failed", {
      path: request.path,
      provider: error.provider,
      status: error.status,
    });
    sendError(response, error.status, {
      error: { code: "PROVIDER_ERROR", message: error.message },
    });
    return;
  }

  writeLog("error", "unhandled_request_error", { path: request.path });
  sendError(response, 500, {
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
  });
};
