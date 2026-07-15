import { z } from "zod";

const positiveInteger = (fallback: number) =>
  z.coerce.number().int().positive().default(fallback);

const environmentSchema = z.object({
  PORT: positiveInteger(3000),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
  PROVIDER_TIMEOUT_MS: positiveInteger(15_000),
  SERPAPI_API_BASE_URL: z.url().default("https://serpapi.com/search.json"),
  SERPAPI_API_KEY: z.string().trim().min(1).optional(),
  FLIGHT_SEARCH_CURRENCY: z.string().trim().regex(/^[A-Z]{3}$/).default("INR"),
  FLIGHT_SEARCH_COUNTRY: z.string().trim().regex(/^[a-z]{2}$/).default("in"),
  FLIGHT_SEARCH_LANGUAGE: z.string().trim().regex(/^[a-z]{2}$/).default("en"),
  FLIGHT_SEARCH_CACHE_TTL_MS: positiveInteger(900_000),
  GEMINI_API_KEY: z.string().trim().min(1).optional(),
  GEMINI_MODEL: z.string().trim().min(1).default("gemini-3.5-flash"),
  GEMINI_FALLBACK_MODEL: z
    .string()
    .trim()
    .min(1)
    .default("gemini-3.1-flash-lite"),
  GEMINI_FALLBACK_COOLDOWN_MS: positiveInteger(900_000),
  GEMINI_TIMEOUT_MS: positiveInteger(60_000),
  TRAVEL_INFO_CACHE_TTL_MS: positiveInteger(86_400_000),
  TRAVEL_INFO_CACHE_MAX_ENTRIES: positiveInteger(100),
  GOOGLE_SEARCH_API_KEY: z.string().trim().optional(),
  GOOGLE_SEARCH_ENGINE_ID: z.string().trim().optional(),
});

export type ServerConfig = ReturnType<typeof loadConfig>;

export const loadConfig = (environment: NodeJS.ProcessEnv = process.env) => {
  const parsed = environmentSchema.safeParse(environment);

  if (!parsed.success) {
    const fields = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");
    throw new Error(`Invalid server configuration: ${fields}.`);
  }

  const googleSearchApiKey = parsed.data.GOOGLE_SEARCH_API_KEY || undefined;
  const googleSearchEngineId =
    parsed.data.GOOGLE_SEARCH_ENGINE_ID || undefined;

  if (Boolean(googleSearchApiKey) !== Boolean(googleSearchEngineId)) {
    throw new Error(
      "GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID must be configured together."
    );
  }

  return {
    port: parsed.data.PORT,
    frontendOrigins: parsed.data.FRONTEND_ORIGIN.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    providerTimeoutMs: parsed.data.PROVIDER_TIMEOUT_MS,
    flightSearch: {
      apiBaseUrl: parsed.data.SERPAPI_API_BASE_URL,
      apiKey: parsed.data.SERPAPI_API_KEY,
      currency: parsed.data.FLIGHT_SEARCH_CURRENCY,
      country: parsed.data.FLIGHT_SEARCH_COUNTRY,
      language: parsed.data.FLIGHT_SEARCH_LANGUAGE,
      cacheTtlMs: parsed.data.FLIGHT_SEARCH_CACHE_TTL_MS,
    },
    gemini: {
      apiKey: parsed.data.GEMINI_API_KEY,
      model: parsed.data.GEMINI_MODEL,
      fallbackModel: parsed.data.GEMINI_FALLBACK_MODEL,
      fallbackCooldownMs: parsed.data.GEMINI_FALLBACK_COOLDOWN_MS,
      timeoutMs: parsed.data.GEMINI_TIMEOUT_MS,
    },
    travelInfoCache: {
      ttlMs: parsed.data.TRAVEL_INFO_CACHE_TTL_MS,
      maxEntries: parsed.data.TRAVEL_INFO_CACHE_MAX_ENTRIES,
    },
    googleSearch: {
      apiKey: googleSearchApiKey,
      searchEngineId: googleSearchEngineId,
    },
  };
};

export const requireSecret = (
  name: string,
  value: string | undefined
): string => {
  if (!value) {
    throw new ServiceConfigurationError(
      `The server is missing required provider configuration: ${name}.`
    );
  }

  return value;
};

export class ServiceConfigurationError extends Error {}
