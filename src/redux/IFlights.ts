export interface Flight {
  id: string;
  source: string;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

interface Itinerary {
  duration: string;
  segments: Segment[];
}

interface Segment {
  departure: AirportDetails;
  arrival: AirportDetails;
  carrierCode: string;
  number: string;
  aircraft: Aircraft;
  operating: Operating;
  duration: string;
  id: string;
  numberOfStops: number;
}

interface AirportDetails {
  iataCode: string;
  terminal?: string;
  at: string;
}

interface Aircraft {
  code: string;
}

interface Operating {
  carrierCode: string;
}

interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}

interface Fee {
  amount: string;
  type: string;
}

interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: TravelerPrice;
  fareDetailsBySegment: FareDetailsBySegment[];
}

interface TravelerPrice {
  currency: string;
  total: string;
  base: string;
}

interface FareDetailsBySegment {
  cabin: string;
}

interface OriginalDestinations {
  id: string;
  originLocationCode: string;
  destinationLocationCode: string;
  departureDateTimeRange: { date: string };
}

interface Travelers {
  id: string;
  travelerType: string;
}

export interface FlightArguments {
  currencyCode: string;
  originDestinations: OriginalDestinations[];
  travelers: Travelers[];
  sources: string[];
  searchCriteria: { maxFlightOffers: number };
}

export interface AirportCodes {
  originCode: string;
  destinationCode: string;
}
