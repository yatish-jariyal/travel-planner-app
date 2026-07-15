import { GoogleGenAI } from "@google/genai";
import { requireSecret, type ServerConfig } from "../../../config.js";
import type { TravelDataGenerator } from "../travelInfo.types.js";
import { shouldFallbackGeminiModel } from "./gemini.errors.js";
import { parseTravelDataResponse } from "./gemini.parser.js";
import { createTravelPrompt, travelResponseSchema } from "./gemini.prompt.js";

export const createGeminiTravelGenerator = (
  config: ServerConfig,
  now: () => number = Date.now
): TravelDataGenerator => {
  let primaryUnavailableUntil = 0;

  return {
    async generate(input) {
      const apiKey = requireSecret("GEMINI_API_KEY", config.gemini.apiKey);
      const ai = new GoogleGenAI({ apiKey });

      const generateWithModel = async (model: string) => {
        const response = await ai.models.generateContent({
          model,
          contents: createTravelPrompt(input),
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: travelResponseSchema,
            httpOptions: { timeout: config.gemini.timeoutMs },
          },
        });
        return parseTravelDataResponse(response.text ?? "");
      };

      const canFallback = config.gemini.fallbackModel !== config.gemini.model;

      if (canFallback && primaryUnavailableUntil > now()) {
        return generateWithModel(config.gemini.fallbackModel);
      }

      try {
        return await generateWithModel(config.gemini.model);
      } catch (error) {
        if (!canFallback || !shouldFallbackGeminiModel(error)) throw error;

        primaryUnavailableUntil = now() + config.gemini.fallbackCooldownMs;
        return generateWithModel(config.gemini.fallbackModel);
      }
    },
  };
};
