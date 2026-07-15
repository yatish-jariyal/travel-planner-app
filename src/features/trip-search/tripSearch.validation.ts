import type { AirportResult } from "../../../shared/api/contracts";

interface TravelFormValues {
  originCity: AirportResult | null;
  destinationCity: AirportResult | null;
  startDate: string;
  endDate: string;
}

const isIsoDate = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

export const validateTravelForm = ({
  originCity,
  destinationCity,
  startDate,
  endDate,
}: TravelFormValues): string[] => {
  const errors: string[] = [];

  if (!originCity) {
    errors.push("Select an origin from the search suggestions.");
  }

  if (!destinationCity) {
    errors.push("Select a destination from the search suggestions.");
  }

  if (
    originCity &&
    destinationCity &&
    (originCity.flightSearchCode ?? originCity.iataCode) ===
      (destinationCity.flightSearchCode ?? destinationCity.iataCode)
  ) {
    errors.push("Origin and destination must be different.");
  }

  if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
    errors.push("Select valid departure and return dates.");
  } else if (endDate < startDate) {
    errors.push("Return date cannot be before the departure date.");
  }

  return errors;
};
