import { ProviderError } from "../../../shared/errors.js";
import type {
  Attraction,
  Hotel,
  TravelDataResponse,
} from "../travelInfo.types.js";

const NOT_AVAILABLE = "Not available";
type UnknownRecord = Record<string, unknown>;

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
) =>
  Array.isArray(value)
    ? value.map(normalize).filter((item): item is T => item !== null)
    : [];

export const parseTravelDataResponse = (rawResponse: string) => {
  const trimmed = rawResponse.trim().replace(/^```(?:json)?\s*|\s*```$/gi, "");
  if (!trimmed) {
    throw new ProviderError("Gemini returned an empty response.", "Gemini");
  }

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
