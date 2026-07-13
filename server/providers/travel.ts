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
  items?: Array<{ link?: string }>;
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

const createPrompt = ({ destinationCity, startDate, endDate }: TravelInfoInput) => `Generate travel suggestions for ${destinationCity} for a stay from ${startDate} to ${endDate}.
Return JSON with two arrays named hotels and attractions. Include up to 20 hotels and 10 attractions.
Each hotel must contain hotelName, stars, availability, price, description, location, and ratings.
Each attraction must contain attractionName, description, location, entryFee, ratings, and imageUrl.
Treat prices, availability, fees, and ratings as generated guidance rather than live booking inventory.`;

export const createTravelService = (
  config: ServerConfig,
  imageClient: AxiosInstance = axios.create({ timeout: config.providerTimeoutMs })
): TravelService => ({
  async getTravelInfo(input) {
    const apiKey = requireSecret("GEMINI_API_KEY", config.gemini.apiKey);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: config.gemini.model,
        contents: createPrompt(input),
        config: {
          responseMimeType: "application/json",
          httpOptions: { timeout: config.providerTimeoutMs },
        },
      });
      const travelData = parseTravelDataResponse(response.text ?? "");
      const { apiKey: searchApiKey, searchEngineId } = config.googleSearch;

      if (!searchApiKey || !searchEngineId) {
        return travelData;
      }

      const attractions = await Promise.all(
        travelData.attractions.map(async (attraction) => {
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
            const imageUrl = response.data.items?.[0]?.link;
            return imageUrl ? { ...attraction, imageUrl } : attraction;
          } catch {
            return attraction;
          }
        })
      );

      return { ...travelData, attractions };
    } catch (error) {
      throw providerError("Gemini", error);
    }
  },
});
