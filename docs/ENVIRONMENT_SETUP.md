# Environment and Credential Setup

## Local setup

```bash
nvm use
npm ci
cp .env.example .env
```

Replace the placeholders, then run `npm run dev`. The command starts the API on port 3000 and Vite on port 5173.

## Variables

| Variable | Requirement | Visibility and purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Optional | Public browser configuration. Leave blank for same-origin requests and local Vite proxying. |
| `PORT` | Optional | Backend port; defaults to `3000`. |
| `FRONTEND_ORIGIN` | Required for cross-origin deployment | Comma-separated browser origins allowed by backend CORS. |
| `PROVIDER_TIMEOUT_MS` | Optional | Outbound provider timeout; defaults to 15 seconds. |
| `SERPAPI_API_BASE_URL` | Optional | SerpApi endpoint; defaults to `https://serpapi.com/search.json`. |
| `SERPAPI_API_KEY` | Required for flights | Backend-only SerpApi credential. |
| `FLIGHT_SEARCH_CURRENCY` | Optional | Three-letter result currency; defaults to `INR`. |
| `FLIGHT_SEARCH_COUNTRY` | Optional | Two-letter Google Flights country; defaults to `in`. |
| `FLIGHT_SEARCH_LANGUAGE` | Optional | Two-letter result language; defaults to `en`. |
| `FLIGHT_SEARCH_CACHE_TTL_MS` | Optional | Identical-search cache lifetime; defaults to 15 minutes. |
| `GEMINI_API_KEY` | Required for suggestions | Backend-only restricted Gemini credential. |
| `GEMINI_MODEL` | Optional | Primary model; defaults to `gemini-3.5-flash`. |
| `GEMINI_FALLBACK_MODEL` | Optional | Quota fallback; defaults to `gemini-3.1-flash-lite`. |
| `GEMINI_FALLBACK_COOLDOWN_MS` | Optional | Time to keep using the fallback after primary-model quota exhaustion; defaults to 15 minutes. |
| `GEMINI_TIMEOUT_MS` | Optional | Gemini generation timeout; defaults to 60 seconds. |
| `TRAVEL_INFO_CACHE_TTL_MS` | Optional | Complete hotel, attraction, and image result cache lifetime; defaults to 24 hours. |
| `TRAVEL_INFO_CACHE_MAX_ENTRIES` | Optional | Maximum process-local travel-information entries; defaults to 100. |
| `GOOGLE_SEARCH_API_KEY` | Optional pair | Backend-only Custom Search key. |
| `GOOGLE_SEARCH_ENGINE_ID` | Optional pair | Search-engine identifier; configure with the search key or omit both. |

Provider secrets are checked when their feature is requested, so `/api/health` remains available even when a provider is intentionally unconfigured.

## Removing the old Amadeus configuration

Delete `AMADEUS_API_BASE_URL`, `AMADEUS_TOKEN_URL`, `AMADEUS_CLIENT_ID`, and `AMADEUS_CLIENT_SECRET` from `.env`. The application no longer reads them. If an old Amadeus credential appeared in Git history, revoke it rather than reusing it.

Do not copy an historically exposed Google key into the new server variable. Create a replacement restricted credential and revoke the old one using the [credential rotation procedure](CREDENTIAL_ROTATION.md).

## Security boundary

Only `VITE_API_BASE_URL` may appear in frontend code. Vite compiles every `VITE_*` value into browser assets, so no secret may use that prefix.

The backend now:

- searches SerpApi and caches identical normalized results for 15 minutes;
- searches the bundled OurAirports index without a provider request or key and
  groups multi-airport cities for broader flight searches;
- calls Gemini through the current server-side Google Gen AI SDK;
- caches successful complete travel-information results and coalesces identical
  in-flight requests without caching provider failures;
- performs optional image search without returning the key;
- validates and rejects unexpected request fields;
- enforces payload limits, rate limits, timeouts, controlled CORS, and security headers;
- returns sanitized errors and never logs credential values or provider responses.

For production, store values in the hosting platform's secret manager. Do not upload `.env` or create a downloadable service-account JSON key merely to deploy on a Google-managed runtime.
