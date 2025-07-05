import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchFlightsInfo } from "../../redux/flightsSlice";
import type { AppDispatch } from "../../redux/store";
import { fetchTravelInfo } from "../../redux/travelSlice";
import CitySearch from "../common/CitySearch";
import AppLoader from "../common/AppLoader";
import DateInput from "../common/DateInput";
import SubmitButton from "../common/SubmitButton";
import { createFlightsPayload } from "../../utils/getFlights";
import { LocationData } from "../../utils/types";

const TravelForm = () => {
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
  };
  const handleDestinationQueryChange = (query: string) => {
    setDestinationQuery(query);
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
        startDate,
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
      {loading && <AppLoader city={destinationCity} />}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-9 border-2 border-teal-800 p-9 rounded-md m-9 bg-white"
      >
        <p className="text-3xl font-bold mb-10 text-teal-700">Plan Your Trip</p>
        <div className="flex gap-9 w-full max-w-md">
          <CitySearch
            onQueryChange={handleOriginQueryChange}
            onCitySelect={handleOriginCitySelect}
            defaultValue={originQuery}
          />
          <CitySearch
            onQueryChange={handleDestinationQueryChange}
            onCitySelect={handleDestinationCitySelect}
            defaultValue={destinationQuery}
          />
        </div>
        <div className="flex gap-9 w-full max-w-md">
          <DateInput
            value={startDate}
            onChange={(value: string) => setStartDate(value)}
            placeholder="From"
          />
          <DateInput
            value={endDate}
            onChange={(value: string) => setEndDate(value)}
            placeholder="To"
          />
        </div>
        <SubmitButton isLoading={loading} />
      </form>
    </div>
  );
};

export default TravelForm;
