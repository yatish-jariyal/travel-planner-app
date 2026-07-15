export interface LocationData {
  id: string;
  name: string;
  iataCode: string;
  flightSearchCode?: string;
  address: {
    cityName: string;
    countryName: string;
    countryCode: string;
  };
}
