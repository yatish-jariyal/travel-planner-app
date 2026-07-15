import { apiClient } from "../../shared/api/apiClient";
import type { TravelDataResponse, TravelInfoRequest } from "./travelInfo.types";

export const fetchTravelInfo = async ({
  destinationCity,
  startDate,
  endDate,
}: TravelInfoRequest): Promise<TravelDataResponse> => {
  const response = await apiClient.post<{ data: TravelDataResponse }>(
    "/api/travel-info",
    { destinationCity, startDate, endDate },
    // Gemini generation is intentionally allowed up to 60 seconds by the API.
    // Give the browser a small transport margin so it receives the API result.
    { timeout: 70_000 }
  );
  return response.data.data;
};
