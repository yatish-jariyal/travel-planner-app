import { apiClient } from "../../shared/api/apiClient";
import type {
  FlightResult,
  FlightSearchRequest,
  FlightSearchResponse,
} from "../../../shared/api/contracts";

export const searchFlights = async (
  request: FlightSearchRequest
): Promise<FlightResult[]> => {
  const response = await apiClient.post<FlightSearchResponse>(
    "/api/flights/search",
    request
  );
  return response.data.data;
};

export const createFlightSearchRequest = ({
  originCode,
  destinationCode,
  startDate,
  endDate,
}: {
  originCode: string;
  destinationCode: string;
  startDate: string;
  endDate: string;
}): FlightSearchRequest => ({
  originCode,
  destinationCode,
  departureDate: startDate,
  returnDate: endDate,
});
