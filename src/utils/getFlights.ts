import axios from "axios";
import { getToken } from "./getToken";
import { Flight, FlightArguments } from "../redux/IFlights";

export const getData = async (body: FlightArguments): Promise<Flight[]> => {
  const token = await getToken();
  const response = await axios.post(
    "https://test.api.amadeus.com/v2/shopping/flight-offers",
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
  const token = await getToken();
  const response = await axios.get(
    `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${city}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log("airport", response);
  return response;
};
