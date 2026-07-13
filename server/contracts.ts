export interface AirportService {
  search(keyword: string): Promise<unknown[]>;
}

export interface FlightService {
  search(payload: FlightSearchPayload): Promise<unknown[]>;
}

export interface TravelService {
  getTravelInfo(input: TravelInfoInput): Promise<TravelDataResponse>;
}

export interface Services {
  airports: AirportService;
  flights: FlightService;
  travel: TravelService;
}

export interface FlightSearchPayload {
  currencyCode: string;
  originDestinations: Array<{
    id: string;
    originLocationCode: string;
    destinationLocationCode: string;
    departureDateTimeRange: { date: string };
  }>;
  travelers: Array<{ id: string; travelerType: string }>;
  sources: string[];
  searchCriteria: { maxFlightOffers: number };
}

export interface TravelInfoInput {
  destinationCity: string;
  startDate: string;
  endDate: string;
}

export interface Hotel {
  hotelName: string;
  stars: string;
  availability: string;
  price: string;
  description: string;
  location: string;
  ratings: string;
}

export interface Attraction {
  attractionName: string;
  description: string;
  location: string;
  entryFee: string;
  ratings: string;
  imageUrl: string;
}

export interface TravelDataResponse {
  hotels: Hotel[];
  attractions: Attraction[];
}
