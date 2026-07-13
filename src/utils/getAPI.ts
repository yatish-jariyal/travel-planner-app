import type { TravelDataResponse } from "../redux/travelSlice";
import { apiClient } from "./apiClient";

export const getTravelInfoFromAI = async (
  destinationCity: string,
  startDate: string,
  endDate: string
): Promise<TravelDataResponse> => {
  const response = await apiClient.post<{ data: TravelDataResponse }>(
    "/api/travel-info",
    { destinationCity, startDate, endDate }
  );
  return response.data.data;
};
