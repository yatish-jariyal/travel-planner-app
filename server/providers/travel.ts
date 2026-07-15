import { GoogleGenAI } from "@google/genai";
import axios, { type AxiosInstance } from "axios";
import { requireSecret, type ServerConfig } from "../config.js";
import type {
  Attraction,
  Hotel,
  TravelDataResponse,
  TravelInfoInput,
  TravelService,
} from "../contracts.js";
import { ProviderError, providerError } from "../errors.js";

const NOT_AVAILABLE = "Not available";
type UnknownRecord = Record<string, unknown>;

interface ImageSearchResponse {
  items?: Array<{ link?: string; image?: { contextLink?: string } }>;
}

interface WikipediaImageResponse {
  query?: {
    pages?: Array<{
      title?: string;
      thumbnail?: { source?: string };
    }>;
  };
}

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (value: unknown, fallback = NOT_AVAILABLE): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value !== "string") {
    return fallback;
  }
  return value.trim() || fallback;
};

const normalizeHotel = (value: unknown): Hotel | null => {
  if (!isRecord(value)) return null;
  const hotelName = readString(value.hotelName, "");
  if (!hotelName) return null;

  return {
    hotelName,
    stars: readString(value.stars),
    availability: readString(value.availability),
    price: readString(value.price),
    description: readString(value.description),
    location: readString(value.location),
    ratings: readString(value.ratings),
  };
};

const normalizeAttraction = (value: unknown): Attraction | null => {
  if (!isRecord(value)) return null;
  const attractionName = readString(value.attractionName, "");
  if (!attractionName) return null;

  return {
    attractionName,
    description: readString(value.description),
    location: readString(value.location),
    entryFee: readString(value.entryFee),
    ratings: readString(value.ratings),
    imageUrl: readString(value.imageUrl, ""),
  };
};

const normalizeCollection = <T>(
  value: unknown,
  normalize: (item: unknown) => T | null
) => (Array.isArray(value) ? value.map(normalize).filter((item): item is T => item !== null) : []);

export const parseTravelDataResponse = (rawResponse: string) => {
  const trimmed = rawResponse.trim().replace(/^```(?:json)?\s*|\s*```$/gi, "");
  if (!trimmed) throw new ProviderError("Gemini returned an empty response.", "Gemini");

  let value: unknown;
  try {
    value = JSON.parse(trimmed);
  } catch {
    throw new ProviderError("Gemini returned invalid travel data.", "Gemini");
  }

  if (!isRecord(value)) {
    throw new ProviderError("Gemini returned invalid travel data.", "Gemini");
  }

  return {
    hotels: normalizeCollection(value.hotels, normalizeHotel),
    attractions: normalizeCollection(value.attractions, normalizeAttraction),
  } satisfies TravelDataResponse;
};

export const TRAVEL_SUGGESTION_COUNT = 6;

const createPrompt = ({ destinationCity, startDate, endDate }: TravelInfoInput) => `Generate travel suggestions for ${destinationCity} for a stay from ${startDate} to ${endDate}.
Return JSON with two arrays named hotels and attractions. Include exactly ${TRAVEL_SUGGESTION_COUNT} hotels and exactly ${TRAVEL_SUGGESTION_COUNT} attractions.
Each hotel must contain hotelName, stars, availability, price, description, location, and ratings.
Each attraction must contain attractionName, description, location, entryFee, and ratings.
Treat prices, availability, fees, and ratings as generated guidance rather than live booking inventory.`;

const stringProperty = { type: "string" } as const;
export const travelResponseSchema = {
  type: "object",
  properties: {
    hotels: {
      type: "array",
      minItems: TRAVEL_SUGGESTION_COUNT,
      maxItems: TRAVEL_SUGGESTION_COUNT,
      items: {
        type: "object",
        properties: {
          hotelName: stringProperty,
          stars: stringProperty,
          availability: stringProperty,
          price: stringProperty,
          description: stringProperty,
          location: stringProperty,
          ratings: stringProperty,
        },
        required: [
          "hotelName",
          "stars",
          "availability",
          "price",
          "description",
          "location",
          "ratings",
        ],
        additionalProperties: false,
      },
    },
    attractions: {
      type: "array",
      minItems: TRAVEL_SUGGESTION_COUNT,
      maxItems: TRAVEL_SUGGESTION_COUNT,
      items: {
        type: "object",
        properties: {
          attractionName: stringProperty,
          description: stringProperty,
          location: stringProperty,
          entryFee: stringProperty,
          ratings: stringProperty,
        },
        required: [
          "attractionName",
          "description",
          "location",
          "entryFee",
          "ratings",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["hotels", "attractions"],
  additionalProperties: false,
} as const;

export const shouldFallbackGeminiModel = (error: unknown) => {
  if (!isRecord(error) || error.status !== 429) return false;
  const message = typeof error.message === "string" ? error.message : "";

  return (
    /generate_content_free_tier_requests|quota exceeded/i.test(message) &&
    !/prepayment credits are depleted/i.test(message)
  );
};

const findAttractionImage = async (
  attraction: Attraction,
  config: ServerConfig,
  imageClient: AxiosInstance
): Promise<Pick<Attraction, "imageUrl" | "imageSourceName" | "imageSourceUrl">> => {
  const { apiKey: searchApiKey, searchEngineId } = config.googleSearch;

  if (searchApiKey && searchEngineId) {
    try {
      const response = await imageClient.get<ImageSearchResponse>(
        "https://www.googleapis.com/customsearch/v1",
        {
          headers: { "x-goog-api-key": searchApiKey },
          params: {
            q: `${attraction.attractionName} ${attraction.location}`,
            cx: searchEngineId,
            searchType: "image",
          },
        }
      );
      const item = response.data.items?.[0];
      if (item?.link) {
        return {
          imageUrl: item.link,
          imageSourceName: item.image?.contextLink ? "Web source" : undefined,
          imageSourceUrl: item.image?.contextLink,
        };
      }
    } catch {
      // Continue to the key-free Wikipedia fallback.
    }
  }

  try {
    const response = await imageClient.get<WikipediaImageResponse>(
      "https://en.wikipedia.org/w/api.php",
      {
        headers: {
          "User-Agent":
            "travel-planner-app/0.0.0 (https://github.com/yatish-jariyal/travel-planner-app)",
        },
        params: {
          action: "query",
          format: "json",
          formatversion: "2",
          generator: "search",
          gsrsearch: `${attraction.attractionName} ${attraction.location}`,
          gsrnamespace: "0",
          gsrlimit: "5",
          prop: "pageimages",
          piprop: "thumbnail",
          pithumbsize: "800",
          pilicense: "free",
        },
      }
    );
    const page = response.data.query?.pages?.find(
      (candidate) => candidate.thumbnail?.source && candidate.title
    );
    if (page?.thumbnail?.source && page.title) {
      return {
        imageUrl: page.thumbnail.source,
        imageSourceName: "Wikipedia",
        imageSourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
          page.title.replace(/ /g, "_")
        )}`,
      };
    }
  } catch {
    // Images are optional; travel suggestions should still be returned.
  }

  return { imageUrl: "" };
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

export const createTravelService = (
  config: ServerConfig,
  imageClient: AxiosInstance = axios.create({ timeout: config.providerTimeoutMs }),
  now: () => number = Date.now
): TravelService => {
  let primaryUnavailableUntil = 0;

  return {
    async getTravelInfo(input) {
      const apiKey = requireSecret("GEMINI_API_KEY", config.gemini.apiKey);

      try {
        const ai = new GoogleGenAI({ apiKey });
        const generateWithModel = async (model: string) => {
          const response = await ai.models.generateContent({
            model,
            contents: createPrompt(input),
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: travelResponseSchema,
              httpOptions: { timeout: config.gemini.timeoutMs },
            },
          });
          return parseTravelDataResponse(response.text ?? "");
        };

        const canFallback =
          config.gemini.fallbackModel !== config.gemini.model;
        let travelData: TravelDataResponse;

        if (canFallback && primaryUnavailableUntil > now()) {
          travelData = await generateWithModel(config.gemini.fallbackModel);
        } else {
          try {
            travelData = await generateWithModel(config.gemini.model);
          } catch (error) {
            if (!canFallback || !shouldFallbackGeminiModel(error)) throw error;

            primaryUnavailableUntil =
              now() + config.gemini.fallbackCooldownMs;
            travelData = await generateWithModel(config.gemini.fallbackModel);
          }
        }

        const attractions = await Promise.all(
          travelData.attractions.map(async (attraction) => ({
            ...attraction,
            ...(await findAttractionImage(attraction, config, imageClient)),
          }))
        );

        return { ...travelData, attractions };
      } catch (error) {
        throw geminiProviderError(error);
      }
    },
  };
};
