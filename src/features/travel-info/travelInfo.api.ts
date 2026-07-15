import { apiClient } from "../../shared/api/apiClient";
import type {
  TravelInfoRequest,
  TravelInfoResponse,
  TravelInfoResult,
} from "../../../shared/api/contracts";

export const fetchTravelInfo = async ({
  destinationCity,
  startDate,
  endDate,
}: TravelInfoRequest): Promise<TravelInfoResult> => {
  const response = await apiClient.post<TravelInfoResponse>(
    "/api/travel-info",
    { destinationCity, startDate, endDate },
    // Gemini generation is intentionally allowed up to 60 seconds by the API.
    // Give the browser a small transport margin so it receives the API result.
    { timeout: 70_000 }
  );
  return response.data.data;
};
