import { apiClient } from "../../shared/api/apiClient";
import type { LocationData } from "./airports.types";

export const searchAirports = async (city: string): Promise<LocationData[]> => {
  const response = await apiClient.get<{ data: LocationData[] }>(
    "/api/airports",
    { params: { keyword: city } }
  );
  return response.data.data;
};
