import { ProviderError, providerError } from "../../../shared/errors.js";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const shouldFallbackGeminiModel = (error: unknown) => {
  if (!isRecord(error) || error.status !== 429) return false;
  const message = typeof error.message === "string" ? error.message : "";

  return (
    /generate_content_free_tier_requests|quota exceeded/i.test(message) &&
    !/prepayment credits are depleted/i.test(message)
  );
};

export const geminiProviderError = (error: unknown) => {
  if (isRecord(error)) {
    const status = typeof error.status === "number" ? error.status : undefined;
    const message = typeof error.message === "string" ? error.message : "";

    if (status === 403 && /API_KEY_SERVICE_BLOCKED/i.test(message)) {
      return new ProviderError(
        "Gemini API access is blocked by this API key's restrictions.",
        "Gemini",
        503
      );
    }

    if (
      status === 403 &&
      /SERVICE_DISABLED|has not been used|is disabled/i.test(message)
    ) {
      return new ProviderError(
        "Gemini API is disabled for this Google Cloud project.",
        "Gemini",
        503
      );
    }

    if (status === 429 && /prepayment credits are depleted/i.test(message)) {
      return new ProviderError(
        "Gemini prepaid billing credits are depleted.",
        "Gemini",
        429
      );
    }

    if (status === 429) {
      return new ProviderError(
        "Gemini request quota has been reached.",
        "Gemini",
        429
      );
    }

    if (status === 504 || /DEADLINE_EXCEEDED/i.test(message)) {
      return new ProviderError("Gemini timed out.", "Gemini", 504);
    }
  }

  return providerError("Gemini", error);
};
