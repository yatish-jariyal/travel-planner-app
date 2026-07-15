export interface SerpAirport {
  id?: string;
  name?: string;
  time?: string;
}

export interface SerpFlightSegment {
  departure_airport?: SerpAirport;
  arrival_airport?: SerpAirport;
  duration?: number;
  airline?: string;
  airline_logo?: string;
  flight_number?: string;
  travel_class?: string;
}

export interface SerpFlightGroup {
  flights?: SerpFlightSegment[];
  total_duration?: number;
  price?: number;
  type?: string;
  airline_logo?: string;
}

export interface SerpApiResponse {
  best_flights?: SerpFlightGroup[];
  other_flights?: SerpFlightGroup[];
  error?: string;
  search_metadata?: {
    status?: string;
  };
}
