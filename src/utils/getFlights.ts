import { Flight, FlightSearchRequest } from "../redux/IFlights";
import type { LocationData } from "./types";
import { apiClient } from "./apiClient";

export const getData = async (body: FlightSearchRequest): Promise<Flight[]> => {
  const response = await apiClient.post<{ data: Flight[] }>(
    "/api/flights/search",
    body
  );
  return response.data.data;
};

export const getAirport = async (city: string): Promise<LocationData[]> => {
  const response = await apiClient.get<{ data: LocationData[] }>(
    "/api/airports",
    { params: { keyword: city } }
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
}) => {
  return {
    originCode,
    destinationCode,
    departureDate: startDate,
    returnDate: endDate,
  };
};
