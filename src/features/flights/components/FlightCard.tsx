import type { FlightResult } from "../../../../shared/api/contracts";
import {
  formatDate,
  formatDuration,
  formatPrice,
  getCabinDisplay,
} from "../flightFormatting";

interface FlightCardProps {
  flight: FlightResult;
}

const FlightCard = ({ flight }: FlightCardProps) => (
  <article className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-center gap-3">
      {flight.airlineLogo && (
        <img
          src={flight.airlineLogo}
          alt=""
          className="h-8 w-8 object-contain"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      <div>
        <h3 className="font-semibold">{flight.airline}</h3>
        <p className="text-sm text-gray-600">{flight.flightNumber}</p>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
        {getCabinDisplay(flight.travelClass.toUpperCase())}
      </span>
      <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">
        {flight.tripType}
      </span>
    </div>

    <p className="mt-3 text-lg font-semibold">
      {formatPrice(flight.price.amount, flight.price.currency)}
    </p>

    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
      <div>
        <p className="font-semibold">{flight.departure.airportCode}</p>
        <p className="text-gray-600">{formatDate(flight.departure.at)}</p>
      </div>
      <span aria-hidden="true">→</span>
      <div className="text-right">
        <p className="font-semibold">{flight.arrival.airportCode}</p>
        <p className="text-gray-600">{formatDate(flight.arrival.at)}</p>
      </div>
    </div>

    <div className="mt-3 flex justify-between text-sm text-gray-700">
      <span>Duration: {formatDuration(flight.durationMinutes)}</span>
      <span>
        {flight.stops === 0
          ? "Nonstop"
          : `${flight.stops} ${flight.stops === 1 ? "stop" : "stops"}`}
      </span>
    </div>
  </article>
);

export default FlightCard;
