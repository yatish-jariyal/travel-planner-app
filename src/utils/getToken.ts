import axios from "axios";
import Cookies from "js-cookie";
import { requireEnvironmentVariable } from "./env";

const TOKEN_EXPIRY = 30000;

interface AmadeusEnvironment {
  VITE_AMADEUS_API_BASE_URL?: string;
  VITE_TOKEN_URL?: string;
  VITE_CLIENT_ID?: string;
  VITE_CLIENT_SECRET?: string;
}

export interface AmadeusConfig {
  apiBaseUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}

export const getAmadeusConfig = (
  environment: AmadeusEnvironment
): AmadeusConfig => ({
  apiBaseUrl: requireEnvironmentVariable(
    "VITE_AMADEUS_API_BASE_URL",
    environment.VITE_AMADEUS_API_BASE_URL
  ).replace(/\/$/, ""),
  tokenUrl: requireEnvironmentVariable(
    "VITE_TOKEN_URL",
    environment.VITE_TOKEN_URL
  ),
  clientId: requireEnvironmentVariable(
    "VITE_CLIENT_ID",
    environment.VITE_CLIENT_ID
  ),
  clientSecret: requireEnvironmentVariable(
    "VITE_CLIENT_SECRET",
    environment.VITE_CLIENT_SECRET
  ),
});

export const fetchToken = async (): Promise<string> => {
  const config = getAmadeusConfig(import.meta.env);
  const response = await axios.post(
    config.tokenUrl,
    {
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const token = response.data.access_token;

  if (typeof token !== "string" || !token) {
    throw new Error("The Amadeus token endpoint returned no access token.");
  }

  Cookies.set("token", token, { expires: 1 / 48 });
  Cookies.set("token_timestamp", Date.now().toString(), {
    expires: 1 / 48,
  });

  return token;
};

export const getToken = async (): Promise<string> => {
  const token = Cookies.get("token");
  const tokenTimestamp = Cookies.get("token_timestamp");

  if (token && tokenTimestamp) {
    const elapsedTime = Date.now() - parseInt(tokenTimestamp, 10);

    if (elapsedTime < TOKEN_EXPIRY) {
      return token;
    }
  }

  return fetchToken();
};
