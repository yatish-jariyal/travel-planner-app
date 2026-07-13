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
| `AMADEUS_API_BASE_URL` | Required for flights | Backend Amadeus API base URL. |
| `AMADEUS_TOKEN_URL` | Required for flights | Backend OAuth token URL. |
| `AMADEUS_CLIENT_ID` | Required for flights | Backend-only Amadeus client identifier. |
| `AMADEUS_CLIENT_SECRET` | Required for flights | Backend-only Amadeus secret. |
| `GEMINI_API_KEY` | Required for suggestions | Backend-only restricted Gemini credential. |
| `GEMINI_MODEL` | Optional | Defaults to the stable `gemini-3.5-flash` model. |
| `GOOGLE_SEARCH_API_KEY` | Optional pair | Backend-only Custom Search key. |
| `GOOGLE_SEARCH_ENGINE_ID` | Optional pair | Search-engine identifier; configure with the search key or omit both. |

Provider secrets are checked when their feature is requested, so `/api/health` remains available even when a provider is intentionally unconfigured.

## Migrating an existing local `.env`

Rename the old browser variables:

| Remove | Replace with |
| --- | --- |
| `VITE_AMADEUS_API_BASE_URL` | `AMADEUS_API_BASE_URL` |
| `VITE_TOKEN_URL` | `AMADEUS_TOKEN_URL` |
| `VITE_CLIENT_ID` | `AMADEUS_CLIENT_ID` |
| `VITE_CLIENT_SECRET` | `AMADEUS_CLIENT_SECRET` |
| `VITE_GEMINI_API_KEY` | `GEMINI_API_KEY` |
| `VITE_GOOGLE_SEARCH_API_KEY` | `GOOGLE_SEARCH_API_KEY` |
| `VITE_GOOGLE_SEARCH_ENGINE_ID` | `GOOGLE_SEARCH_ENGINE_ID` |

Do not copy an historically exposed Google key into the new server variable. Create a replacement restricted credential and revoke the old one using the [credential rotation procedure](CREDENTIAL_ROTATION.md).

## Security boundary

Only `VITE_API_BASE_URL` may appear in frontend code. Vite compiles every `VITE_*` value into browser assets, so no secret may use that prefix.

The backend now:

- exchanges Amadeus credentials and caches the access token in server memory;
- calls Gemini through the current server-side Google Gen AI SDK;
- performs optional image search without returning the key;
- validates and rejects unexpected request fields;
- enforces payload limits, rate limits, timeouts, controlled CORS, and security headers;
- returns sanitized errors and never logs credential values or provider responses.

For production, store values in the hosting platform's secret manager. Do not upload `.env` or create a downloadable service-account JSON key merely to deploy on a Google-managed runtime.
