export interface GeoCode {
  latitude: number;
  longitude: number;
}

interface Address {
  cityName: string;
  cityCode: string;
  countryName: string;
  countryCode: string;
  stateCode: string;
  regionCode: string;
}

interface Analytics {
  travelers: {
    score: number;
  };
}

export interface LocationData {
  type: string;
  name: string;
  id: string;
  timeZoneOffset: string;
  iataCode: string;
  geoCode: GeoCode;
  address: Address;
  analytics: Analytics;
}
