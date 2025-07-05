import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchFlightsInfo } from "../redux/flightsSlice";
import type { AppDispatch } from "../redux/store";
import { fetchTravelInfo } from "../redux/travelSlice";
import CitySearch, { LocationData } from "./CitySearch";

const FlightForm = () => {
  const [startDate, setStartDate] = useState("2025-04-10");
  const [endDate, setEndDate] = useState("2025-04-20");
  const [loading, setLoading] = useState(false);
  const [originQuery, setOriginQuery] = useState<string>("");
  const [originCity, setOriginCity] = useState<LocationData | null>(null);
  const [destinationQuery, setDestinationQuery] = useState<string>("");
  const [destinationCity, setDestinationCity] = useState<LocationData | null>(
    null
  );

  const handleOriginQueryChange = (query: string) => {
    setOriginQuery(query);
    // console.log('Current query:', query);
  };
  const handleDestinationQueryChange = (query: string) => {
    setDestinationQuery(query);
    // console.log('Current query:', query);
  };

  const handleOriginCitySelect = (city: LocationData) => {
    setOriginCity(city);
    console.log("Selected origin city:", city);
  };
  const handleDestinationCitySelect = (city: LocationData) => {
    setDestinationCity(city);
    console.log("Selected destination city:", city);
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const createFlightsPayload = ({
    originCode,
    destinationCode,
  }: {
    originCode: string;
    destinationCode: string;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!originCity || !destinationCity) {
        console.log("Origin or destination city is not selected");
        return;
      }
      const flightsPayload = createFlightsPayload({
        originCode: originCity.iataCode,
        destinationCode: destinationCity.iataCode,
      });
      await dispatch(
        fetchTravelInfo({
          destinationCity: destinationCity.address.cityName,
          startDate,
          endDate,
        })
      );
      await dispatch(fetchFlightsInfo(flightsPayload));
      navigate("/travel");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4">
              <svg
                className="animate-spin w-full h-full text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-teal-700 font-bold text-xl">
                Finding Your Perfect Itinerary
              </p>
              <p className="text-gray-600 mt-2">
                Exploring options for {destinationCity?.address.cityName}...
              </p>
              <div className="flex items-center justify-center mt-4 space-x-1">
                <div
                  className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-9 border-2 border-teal-800 p-9 rounded-md m-9 bg-white"
      >
        <p className="text-3xl font-bold mb-10 text-teal-700">Plan Your Trip</p>
        <div className="flex gap-9 w-full max-w-md">
          {/* <input
            type="text"
            placeholder="Enter Origin Here"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          /> */}
          <CitySearch
            onQueryChange={handleOriginQueryChange}
            onCitySelect={handleOriginCitySelect}
            defaultValue={originQuery}
          />
          {/* <input
            type="text"
            placeholder="Enter Destination Here"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          /> */}
          <CitySearch
            onQueryChange={handleDestinationQueryChange}
            onCitySelect={handleDestinationCitySelect}
            defaultValue={destinationQuery}
          />
        </div>
        <div className="flex gap-9 w-full max-w-md">
          <input
            type="date"
            placeholder="From"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <input
            type="date"
            placeholder="To"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg py-3 px-8 bg-teal-700 text-white cursor-pointer hover:bg-teal-800 transition-colors duration-300 font-medium text-lg w-full max-w-md shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Itinerary"}
        </button>
      </form>
    </div>
  );
};

export default FlightForm;
