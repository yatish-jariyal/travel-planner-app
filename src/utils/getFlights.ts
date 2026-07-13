import { Flight, FlightArguments } from "../redux/IFlights";
import type { LocationData } from "./types";
import { apiClient } from "./apiClient";

export const getData = async (body: FlightArguments): Promise<Flight[]> => {
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

export const createFlightsPayload = ({
  originCode,
  destinationCode,
  startDate,
}: {
  originCode: string;
  destinationCode: string;
  startDate: string;
}) => {
  return {
    currencyCode: "INR",
    originDestinations: [
      {
        id: "1",
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDateTimeRange: {
          date: startDate,
        },
      },
    ],
    travelers: [
      {
        id: "1",
        travelerType: "ADULT",
      },
    ],
    sources: ["GDS"],
    searchCriteria: {
      maxFlightOffers: 20,
    },
  };
};
