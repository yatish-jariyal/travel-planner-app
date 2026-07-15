import { apiClient } from "../../shared/api/apiClient";
import type { Flight, FlightSearchRequest } from "./flights.types";

export const searchFlights = async (
  request: FlightSearchRequest
): Promise<Flight[]> => {
  const response = await apiClient.post<{ data: Flight[] }>(
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
