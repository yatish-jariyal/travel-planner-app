import axios, { type AxiosInstance } from "axios";
import { requireSecret, type ServerConfig } from "../config.js";
import type {
  AirportService,
  FlightSearchPayload,
  FlightService,
} from "../contracts.js";
import { providerError } from "../errors.js";

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
}

interface CollectionResponse {
  data?: unknown[];
}

export const createAmadeusServices = (
  config: ServerConfig,
  client: AxiosInstance = axios.create({ timeout: config.providerTimeoutMs })
): { airports: AirportService; flights: FlightService } => {
  let cachedToken: { value: string; expiresAt: number } | undefined;
  let tokenRequest: Promise<string> | undefined;

  const fetchToken = async () => {
    const clientId = requireSecret(
      "AMADEUS_CLIENT_ID",
      config.amadeus.clientId
    );
    const clientSecret = requireSecret(
      "AMADEUS_CLIENT_SECRET",
      config.amadeus.clientSecret
    );

    try {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      });
      const response = await client.post<TokenResponse>(
        config.amadeus.tokenUrl,
        body,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const token = response.data.access_token;

      if (!token) {
        throw new Error("Missing access token");
      }

      const lifetimeSeconds = Math.max(response.data.expires_in ?? 1_800, 60);
      cachedToken = {
        value: token,
        expiresAt: Date.now() + lifetimeSeconds * 1_000 - 30_000,
      };
      return token;
    } catch (error) {
      throw providerError("Amadeus authentication", error);
    }
  };

  const getToken = async () => {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
      return cachedToken.value;
    }

    tokenRequest ??= fetchToken().finally(() => {
      tokenRequest = undefined;
    });
    return tokenRequest;
  };

  const authorizationHeaders = async () => ({
    Authorization: `Bearer ${await getToken()}`,
    "Content-Type": "application/json",
  });

  return {
    airports: {
      async search(keyword) {
        try {
          const response = await client.get<CollectionResponse>(
            `${config.amadeus.apiBaseUrl}/v1/reference-data/locations`,
            {
              headers: await authorizationHeaders(),
              params: {
                subType: "AIRPORT,CITY",
                keyword,
                "page[limit]": 10,
                "page[offset]": 0,
                sort: "analytics.travelers.score",
                view: "FULL",
              },
            }
          );
          return response.data.data ?? [];
        } catch (error) {
          throw providerError("Amadeus airport search", error);
        }
      },
    },
    flights: {
      async search(payload: FlightSearchPayload) {
        try {
          const response = await client.post<CollectionResponse>(
            `${config.amadeus.apiBaseUrl}/v2/shopping/flight-offers`,
            payload,
            { headers: await authorizationHeaders() }
          );
          return response.data.data ?? [];
        } catch (error) {
          throw providerError("Amadeus flight search", error);
        }
      },
    },
  };
};
