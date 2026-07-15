export interface ApiSuccessResponse<T> {
  data: T;
}

export type ApiErrorCode =
  | "INTERNAL_ERROR"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "ORIGIN_NOT_ALLOWED"
  | "PROVIDER_ERROR"
  | "SERVICE_NOT_CONFIGURED";

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    fields?: string[];
  };
}

export interface HealthResponse {
  status: "ok";
}

export interface AirportSearchQuery {
  keyword: string;
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

export type AirportSearchResponse = ApiSuccessResponse<AirportResult[]>;

export interface FlightSearchRequest {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
}

export interface FlightLocation {
  airportCode: string;
  airportName: string;
  at: string;
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departure: FlightLocation;
  arrival: FlightLocation;
  durationMinutes: number;
  stops: number;
  price: { currency: string; amount: number };
  travelClass: string;
  tripType: string;
}

export type FlightSearchResponse = ApiSuccessResponse<FlightResult[]>;

export interface TravelInfoRequest {
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

export interface TravelInfoResult {
  hotels: Hotel[];
  attractions: Attraction[];
}

export type TravelInfoResponse = ApiSuccessResponse<TravelInfoResult>;
