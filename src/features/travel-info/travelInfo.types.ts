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

export interface TravelDataResponse {
  hotels: Hotel[];
  attractions: Attraction[];
}
