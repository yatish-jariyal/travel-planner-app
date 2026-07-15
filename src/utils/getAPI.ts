import type { TravelDataResponse } from "../redux/travelSlice";
import { apiClient } from "./apiClient";

export const getTravelInfoFromAI = async (
  destinationCity: string,
  startDate: string,
  endDate: string
): Promise<TravelDataResponse> => {
  const response = await apiClient.post<{ data: TravelDataResponse }>(
    "/api/travel-info",
    { destinationCity, startDate, endDate },
    // Gemini generation is intentionally allowed up to 60 seconds by the API.
    // Give the browser a small transport margin so it receives the API result.
    { timeout: 70_000 }
  );
  return response.data.data;
};
