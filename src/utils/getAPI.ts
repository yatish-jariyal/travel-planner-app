import { GoogleGenerativeAI } from "@google/generative-ai";
import { TravelDataResponse } from "../redux/travelSlice";
import axios from "axios";

const isString = (v: unknown): v is string => typeof v === "string";

const isTravelDataResponse = (data: unknown): data is TravelDataResponse => {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.hotels) || !Array.isArray(d.attractions)) return false;
  return true;
};

export const getTravelInfoFromAI = async (
  destination: string,
  startDate: string,
  endDate: string
): Promise<TravelDataResponse> => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
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
      "location": "Neighborhood or area within {destination}",
      "ratings": "Guest rating out of 5 based on recent reviews"
    }
  ],
  "attractions": [
    {
      "attractionName": "Name of the attraction",
      "description": "Brief description of the attraction",
      "location": "Location within {destination}",
      "entryFee": "Entry fee if applicable",
      "ratings": "Visitor rating out of 5",
      "imageUrl": "Image url of the attraction"
    }
  ]
}
  Important: Return ONLY valid JSON with NO additional text or explanation.
Please include 20 hotels sorted by overall value (considering price, location, and ratings) with a mix of luxury, mid-range, and boutique options. Also include 10 top attractions in {destination}.`;

    const result = await model.generateContent(prompt);
    const jsonString =
      result.response?.candidates?.[0]?.content?.parts[0]?.text?.replace(
        /```json\n|\n```/g,
        ""
      );

    if (!jsonString) {
      throw new Error("Failed to get valid response from AI");
    }

    const parsed = JSON.parse(jsonString) as unknown;
    if (!isTravelDataResponse(parsed)) {
      throw new Error("Invalid travel data response shape");
    }
    const jsonData = parsed;

    const googleApiKey = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_KEY;
    const cxId = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_CX;

    if (!isString(googleApiKey) || !isString(cxId)) {
      throw new Error("Missing Google Custom Search configuration");
    }

    await Promise.allSettled(
      jsonData.attractions.map(async (attraction) => {
        const imageResponse = await axios.get(
          `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            attraction.imageUrl
          )}&cx=${cxId}&searchType=image&key=${googleApiKey}`
        );
        const imageUrl = imageResponse?.data?.items?.[0]?.link;
        if (isString(imageUrl)) {
          attraction.imageUrl = imageUrl;
        }
      })
    );

    return jsonData;
  } catch (error) {
    console.error("Error fetching travel info:", error);
    throw error;
  }
};
