import type {
  Attraction,
  TravelInfoRequest,
  TravelInfoResult,
} from "../../../shared/api/contracts.js";

export interface TravelService {
  getTravelInfo(input: TravelInfoRequest): Promise<TravelInfoResult>;
}

export interface TravelDataGenerator {
  generate(input: TravelInfoRequest): Promise<TravelInfoResult>;
}

export interface AttractionImageService {
  enrich(attractions: Attraction[]): Promise<Attraction[]>;
}

export type AttractionImage = Pick<
  Attraction,
  "imageUrl" | "imageSourceName" | "imageSourceUrl"
>;

export type {
  Attraction,
  Hotel,
  TravelInfoRequest,
  TravelInfoResult,
} from "../../../shared/api/contracts.js";
