import { GoogleGenerativeAI } from "@google/generative-ai";
import axios, { type AxiosRequestConfig } from "axios";
import type {
  Attraction,
  Hotel,
  TravelDataResponse,
} from "../redux/travelSlice";
import { requireEnvironmentVariable } from "./env";

const NOT_AVAILABLE = "Not available";

type UnknownRecord = Record<string, unknown>;

interface ImageSearchResponse {
  items?: Array<{ link?: string }>;
}

interface ImageSearchClient {
  get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<{ data: T }>;
}

export interface ImageSearchConfig {
  apiKey: string;
  searchEngineId: string;
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

  const normalizedValue = value.trim();
  return normalizedValue || fallback;
};

const normalizeHotel = (value: unknown): Hotel | null => {
  if (!isRecord(value)) {
    return null;
  }

  const hotelName = readString(value.hotelName, "");
  if (!hotelName) {
    return null;
  }

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
  if (!isRecord(value)) {
    return null;
  }

  const attractionName = readString(value.attractionName, "");
  if (!attractionName) {
    return null;
  }

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
  normalizeItem: (item: unknown) => T | null
): T[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeItem)
    .filter((item): item is T => item !== null);
};

const removeMarkdownFence = (value: string): string => {
  const trimmedValue = value.trim().replace(/^\uFEFF/, "");
  const fencedJson = trimmedValue.match(
    /^```(?:json)?\s*([\s\S]*?)\s*```$/i
  );

  return (fencedJson?.[1] ?? trimmedValue).trim();
};

export const parseTravelDataResponse = (rawResponse: string): TravelDataResponse => {
  const jsonText = removeMarkdownFence(rawResponse);

  if (!jsonText) {
    throw new Error("The AI returned an empty response.");
  }

  let parsedResponse: unknown;

  try {
    parsedResponse = JSON.parse(jsonText);
  } catch {
    throw new Error("The AI returned invalid JSON.");
  }

  if (!isRecord(parsedResponse)) {
    throw new Error("The AI response has an invalid structure.");
  }

  return {
    hotels: normalizeCollection(parsedResponse.hotels, normalizeHotel),
    attractions: normalizeCollection(
      parsedResponse.attractions,
      normalizeAttraction
    ),
  };
};

export const enrichAttractionImages = async (
  travelData: TravelDataResponse,
  config: ImageSearchConfig,
  client: ImageSearchClient = axios
): Promise<TravelDataResponse> => {
  if (!config.apiKey || !config.searchEngineId) {
    return travelData;
  }

  const attractions = await Promise.all(
    travelData.attractions.map(async (attraction) => {
      try {
        const imageResponse = await client.get<ImageSearchResponse>(
          "https://www.googleapis.com/customsearch/v1",
          {
            params: {
              q: `${attraction.attractionName} ${attraction.location}`,
              cx: config.searchEngineId,
              searchType: "image",
              key: config.apiKey,
            },
          }
        );
        const imageUrl = imageResponse.data.items?.[0]?.link;

        return imageUrl ? { ...attraction, imageUrl } : attraction;
      } catch {
        return attraction;
      }
    })
  );

  return { ...travelData, attractions };
};

export const getTravelInfoFromAI = async (
  destination: string,
  startDate: string,
  endDate: string
): Promise<TravelDataResponse> => {
  const geminiApiKey = requireEnvironmentVariable(
    "VITE_GEMINI_API_KEY",
    import.meta.env.VITE_GEMINI_API_KEY
  );

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Generate data for ${destination} for a stay from ${startDate} to ${endDate} in JSON format with the following structure:
{
  "hotels": [
    {
      "hotelName": "Hotel name",
      "stars": "Number of stars the hotel has",
      "availability": "Available/Limited availability/Not available for the specified dates",
      "price": "Price range per night in local currency",
      "description": "Brief description including amenities and unique features",
      "location": "Neighborhood or area within ${destination}",
      "ratings": "Guest rating out of 5 based on recent reviews"
    }
  ],
  "attractions": [
    {
      "attractionName": "Name of the attraction",
      "description": "Brief description of the attraction",
      "location": "Location within ${destination}",
      "entryFee": "Entry fee if applicable",
      "ratings": "Visitor rating out of 5",
      "imageUrl": "Image URL of the attraction, when known"
    }
  ]
}
Important: Return only valid JSON with no additional text or explanation.
Include 20 hotels sorted by overall value with a mix of luxury, mid-range, and boutique options. Also include 10 top attractions in ${destination}.`;

  const result = await model.generateContent(prompt);
  const travelData = parseTravelDataResponse(result.response.text());

  return enrichAttractionImages(travelData, {
    apiKey: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY ?? "",
    searchEngineId: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID ?? "",
  });
};
