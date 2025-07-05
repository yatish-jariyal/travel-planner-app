import React from "react";
import { Flight } from "../../redux/IFlights";
import {
  formatDate,
  formatDuration,
  getCabinDisplay,
} from "../../utils/helper";

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const firstSegment = flight.itineraries[0]?.segments[0];

  const cabinClass =
    flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || "Economy";

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
        {formatDate(firstSegment?.departure.at || "")} -
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
