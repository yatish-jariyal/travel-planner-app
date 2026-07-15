export interface AirportService {
  search(keyword: string): Promise<AirportResult[]>;
}

export interface FlightService {
  search(payload: FlightSearchPayload): Promise<FlightResult[]>;
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
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
}

export interface AirportResult {
  id: string;
  iataCode: string;
  flightSearchCode?: string;
  name: string;
  address: {
    cityName: string;
    countryName: string;
    countryCode: string;
  };
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departure: { airportCode: string; airportName: string; at: string };
  arrival: { airportCode: string; airportName: string; at: string };
  durationMinutes: number;
  stops: number;
  price: { currency: string; amount: number };
  travelClass: string;
  tripType: string;
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
  imageSourceName?: string;
  imageSourceUrl?: string;
}

export interface TravelDataResponse {
  hotels: Hotel[];
  attractions: Attraction[];
}
