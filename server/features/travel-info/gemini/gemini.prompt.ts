import type { TravelInfoInput } from "../travelInfo.types.js";

export const TRAVEL_SUGGESTION_COUNT = 6;

export const createTravelPrompt = ({
  destinationCity,
  startDate,
  endDate,
}: TravelInfoInput) => `Generate travel suggestions for ${destinationCity} for a stay from ${startDate} to ${endDate}.
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
