export interface FlightService {
  search(payload: FlightSearchPayload): Promise<FlightResult[]>;
}

export interface FlightSearchPayload {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
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
