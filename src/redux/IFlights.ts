export interface FlightLocation {
  airportCode: string;
  airportName: string;
  at: string;
}

export interface Flight {
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

export interface FlightSearchRequest {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
}
