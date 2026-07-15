import type {
  FlightResult,
  FlightSearchRequest,
} from "../../../shared/api/contracts.js";

export interface FlightService {
  search(payload: FlightSearchRequest): Promise<FlightResult[]>;
}

export type {
  FlightResult,
  FlightSearchRequest,
} from "../../../shared/api/contracts.js";
