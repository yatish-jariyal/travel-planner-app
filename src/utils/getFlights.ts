import axios from "axios";
import { getAmadeusConfig, getToken } from "./getToken";
import { Flight, FlightArguments } from "../redux/IFlights";

export const getData = async (body: FlightArguments): Promise<Flight[]> => {
  const config = getAmadeusConfig(import.meta.env);
  const token = await getToken();
  const response = await axios.post(
    `${config.apiBaseUrl}/v2/shopping/flight-offers`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const getAirport = async (city: string) => {
  const config = getAmadeusConfig(import.meta.env);
  const token = await getToken();
  const response = await axios.get(
    `${config.apiBaseUrl}/v1/reference-data/locations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        subType: "AIRPORT,CITY",
        keyword: city,
        "page[limit]": 10,
        "page[offset]": 0,
        sort: "analytics.travelers.score",
        view: "FULL",
      },
    }
  );
  return response;
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
