export interface AirportService {
  search(keyword: string): Promise<AirportResult[]>;
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
