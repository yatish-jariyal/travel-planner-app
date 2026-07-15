import { useEffect, useRef, useState } from "react";
import { addDays, format } from "date-fns";
import { useNavigate } from "react-router";
import {
  clearFlightsData,
  loadFlights,
  selectFlightsStatus,
} from "../../flights/flights.slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearTravelData,
  loadTravelInfo,
  selectTravelStatus,
} from "../../travel-info/travelInfo.slice";
import { createFlightSearchRequest } from "../../flights/flights.api";
import { validateTravelForm } from "../tripSearch.validation";
import type { AirportResult } from "../../../../shared/api/contracts";
import AppLoader from "./AppLoader";
import CitySearch from "./CitySearch";
import DateInput from "./DateInput";
import SubmitButton from "./SubmitButton";

const TravelForm = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [originQuery, setOriginQuery] = useState("");
  const [originCity, setOriginCity] = useState<AirportResult | null>(null);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationCity, setDestinationCity] = useState<AirportResult | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const flightsStatus = useAppSelector(selectFlightsStatus);
  const travelStatus = useAppSelector(selectTravelStatus);
  const isLoading =
    flightsStatus === "loading" || travelStatus === "loading";

  useEffect(() => {
    if (validationErrors.length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [validationErrors]);

  const handleOriginQueryChange = (query: string) => {
    setOriginQuery(query);
    if (query !== originCity?.iataCode) {
      setOriginCity(null);
    }
  };

  const handleDestinationQueryChange = (query: string) => {
    setDestinationQuery(query);
    if (query !== destinationCity?.iataCode) {
      setDestinationCity(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateTravelForm({
      originCity,
      destinationCity,
      startDate,
      endDate,
    });
    setValidationErrors(errors);

    if (errors.length > 0 || !originCity || !destinationCity) {
      return;
    }

    dispatch(clearTravelData());
    dispatch(clearFlightsData());

    const flightsPayload = createFlightSearchRequest({
      originCode: originCity.flightSearchCode ?? originCity.iataCode,
      destinationCode:
        destinationCity.flightSearchCode ?? destinationCity.iataCode,
      startDate,
      endDate,
    });

    await Promise.all([
      dispatch(
        loadTravelInfo({
          destinationCity: destinationCity.address.cityName,
          startDate,
          endDate,
        })
      ),
      dispatch(loadFlights(flightsPayload)),
    ]);

    navigate("/travel");
  };

  return (
    <div className="relative">
      {isLoading && <AppLoader city={destinationCity} />}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isLoading}
        className="flex flex-col items-center gap-9 border-2 border-teal-800 p-9 rounded-md m-9 bg-white"
      >
        <h1 className="text-3xl font-bold mb-10 text-teal-700">
          Plan Your Trip
        </h1>

        {validationErrors.length > 0 && (
          <div
            ref={errorSummaryRef}
            className="w-full max-w-md rounded-lg border border-red-300 bg-red-50 p-4 text-red-900"
            role="alert"
            tabIndex={-1}
          >
            <p className="font-semibold">Check your trip details:</p>
            <ul className="mt-2 list-disc pl-5">
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
          <CitySearch
            label="Origin"
            onQueryChange={handleOriginQueryChange}
            onCitySelect={setOriginCity}
            defaultValue={originQuery}
          />
          <CitySearch
            label="Destination"
            onQueryChange={handleDestinationQueryChange}
            onCitySelect={setDestinationCity}
            defaultValue={destinationQuery}
          />
        </div>
        <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
          <DateInput
            label="Departure date"
            value={startDate}
            min={today}
            onChange={setStartDate}
          />
          <DateInput
            label="Return date"
            value={endDate}
            min={startDate}
            onChange={setEndDate}
          />
        </div>
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

export default TravelForm;
