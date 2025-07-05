import React from "react";
import { format } from "date-fns";
import { Flight } from "../redux/IFlights";

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  // Get the first segment of the first itinerary for display
  const firstSegment = flight.itineraries[0]?.segments[0];

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, h:mm a");
    } catch (e) {
      console.log(e);
      return dateString;
    }
  };

  // Format duration from PT2H10M to 2h 10m
  const formatDuration = (duration: string) => {
    const hours = duration.match(/(\d+)H/);
    const minutes = duration.match(/(\d+)M/);
    return `${hours ? hours[1] + "h " : ""}${
      minutes ? minutes[1] + "m" : ""
    }`.trim();
  };

  // Get cabin class
  const cabinClass =
    flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || "Economy";

  // Map cabin class to user-friendly string
  const getCabinDisplay = (cabin: string) => {
    const cabinMap: Record<string, string> = {
      ECONOMY: "Economy",
      PREMIUM_ECONOMY: "Premium Economy",
      BUSINESS: "Business",
      FIRST: "First",
    };
    return cabinMap[cabin] || cabin;
  };

  // Get airline name
  // const airlineCode = flight.validatingAirlineCodes[0] || firstSegment?.carrierCode;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <p>
        {firstSegment?.carrierCode} {firstSegment?.number}
      </p>

      <div className="mt-2">
        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {getCabinDisplay(cabinClass)}
        </span>
        {flight.numberOfBookableSeats > 0 && (
          <span className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            {flight.numberOfBookableSeats} seats available
          </span>
        )}
      </div>

      <p className="mt-2 font-medium">
        {flight.price.currency} {flight.price.total}
      </p>

      <p className="mt-2 text-sm text-gray-600">
        {formatDate(firstSegment?.departure.at || "")} -{" "}
        {formatDate(firstSegment?.arrival.at || "")}
      </p>

      <p className="mt-2 text-sm">
        Duration: {formatDuration(flight.itineraries[0]?.duration || "")}
      </p>

      <div className="mt-2 flex items-center">
        <span className="text-sm">
          Stops: {flight.itineraries[0]?.segments.length - 1 || 0}
        </span>
      </div>
    </div>
  );
};

export default FlightCard;
