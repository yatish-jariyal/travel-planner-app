# Environment and Credential Setup

## Quick setup

Use Node 22 and create a local environment file from the committed template:

```bash
nvm use
npm ci
cp .env.example .env
```

Replace every required placeholder in `.env`, then start the application with `npm run dev`. Vite reads `.env` when the development server starts, so restart the server after changing a variable.

## Variables

| Variable | Requirement | Purpose |
| --- | --- | --- |
| `VITE_AMADEUS_API_BASE_URL` | Required for flights | Amadeus API base URL. `.env.example` uses the test environment. |
| `VITE_TOKEN_URL` | Required for flights | Amadeus OAuth token endpoint. The test endpoint is included in `.env.example`. |
| `VITE_CLIENT_ID` | Required for flights | Amadeus application client ID. |
| `VITE_CLIENT_SECRET` | Required for flights | Amadeus application client secret. It is exposed by the current browser-only architecture. |
| `VITE_GEMINI_API_KEY` | Required for hotels and attractions | Authenticates Gemini travel-suggestion requests. |
| `VITE_GOOGLE_SEARCH_API_KEY` | Optional pair | Enables Google Custom Search image enrichment when paired with the search-engine ID. |
| `VITE_GOOGLE_SEARCH_ENGINE_ID` | Optional pair | Identifies the Google Programmable Search Engine used for attraction images. |

If the Google Search pair is missing or an image request fails, the application keeps the attraction information and any image URL returned by Gemini.

Missing Amadeus or Gemini configuration now produces an error that names the absent variable instead of sending a request with `undefined` credentials.

## What `.env` protects—and what it does not

The repository ignores `.env`, which prevents an accidental Git commit during normal development. That does not make `VITE_*` values private.

Vite replaces `VITE_*` references during the build and includes their values in browser-delivered JavaScript. Anyone who can load the application can inspect those values. Therefore:

- Never treat a `VITE_*` value as a production secret.
- Never commit a populated `.env` file.
- Restrict development keys by API, quota, referrer, and environment where the provider supports it.
- Revoke and rotate any key that has appeared in source code or Git history.

The Google API key previously embedded in `src/utils/getAPI.ts` must be considered exposed even though it has been removed from the latest source. Git history still contains the old value.

## Recommended production architecture

Before deployment, introduce a backend or serverless API owned by this project:

```text
Browser -> Travel Planner API -> Amadeus / Gemini / Google APIs
```

The browser should send trip inputs to project endpoints such as `/api/flights` and `/api/travel`. The server should:

- Read private credentials from its hosting platform's secret store.
- Exchange Amadeus client credentials for tokens server-side.
- Call Gemini and Google services without returning credentials to the browser.
- Validate inputs and return only the data the UI needs.
- Apply rate limits, timeouts, logging, and provider-specific error handling.

After that migration, private credentials should lose the `VITE_` prefix and exist only in server configuration. The checked-in `.env.example` should continue to contain placeholders, never live values.

## Credential incident checklist

For the previously committed Google key:

1. Revoke or rotate it in the provider account.
2. Review recent usage and quota activity.
3. Restrict the replacement key to only the required API and environment.
4. Do not paste the replacement into tracked files.
5. Use a server-side secret store before production deployment.

Rewriting Git history is optional after revocation and requires coordination with every clone. History rewriting is not a substitute for revoking an exposed credential.
