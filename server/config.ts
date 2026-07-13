import { z } from "zod";

const positiveInteger = (fallback: number) =>
  z.coerce.number().int().positive().default(fallback);

const environmentSchema = z.object({
  PORT: positiveInteger(3000),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
  PROVIDER_TIMEOUT_MS: positiveInteger(15_000),
  AMADEUS_API_BASE_URL: z
    .url()
    .default("https://test.api.amadeus.com"),
  AMADEUS_TOKEN_URL: z
    .url()
    .default("https://test.api.amadeus.com/v1/security/oauth2/token"),
  AMADEUS_CLIENT_ID: z.string().trim().min(1).optional(),
  AMADEUS_CLIENT_SECRET: z.string().trim().min(1).optional(),
  GEMINI_API_KEY: z.string().trim().min(1).optional(),
  GEMINI_MODEL: z.string().trim().min(1).default("gemini-3.5-flash"),
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
    amadeus: {
      apiBaseUrl: parsed.data.AMADEUS_API_BASE_URL.replace(/\/$/, ""),
      tokenUrl: parsed.data.AMADEUS_TOKEN_URL,
      clientId: parsed.data.AMADEUS_CLIENT_ID,
      clientSecret: parsed.data.AMADEUS_CLIENT_SECRET,
    },
    gemini: {
      apiKey: parsed.data.GEMINI_API_KEY,
      model: parsed.data.GEMINI_MODEL,
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
