import type { AirportResult } from "../../../shared/api/contracts.js";

export interface AirportService {
  search(keyword: string): Promise<AirportResult[]>;
}

export type { AirportResult } from "../../../shared/api/contracts.js";
