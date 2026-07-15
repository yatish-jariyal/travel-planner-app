import { apiClient } from "../../shared/api/apiClient";
import type {
  AirportResult,
  AirportSearchResponse,
} from "../../../shared/api/contracts";

export const searchAirports = async (city: string): Promise<AirportResult[]> => {
  const response = await apiClient.get<AirportSearchResponse>(
    "/api/airports",
    { params: { keyword: city } }
  );
  return response.data.data;
};
