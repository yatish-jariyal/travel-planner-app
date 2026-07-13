# Backend Deployment

## Runtime contract

The backend requires Node 22 and is built with:

```bash
npm ci
npm run build
```

Start the compiled API with:

```bash
npm run start
```

The platform must route the browser's `/api/*` requests to the Node process. If the frontend and API use different origins, set `VITE_API_BASE_URL` to the public HTTPS API address and configure `FRONTEND_ORIGIN` with the exact frontend origin.

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Liveness check without provider access. |
| `GET /api/airports?keyword=Delhi` | Validated Amadeus airport search. |
| `POST /api/flights/search` | Validated Amadeus flight-offer request. |
| `POST /api/travel-info` | Gemini suggestions plus optional image enrichment. |

## Secret storage

Create server-side secrets for:

- `AMADEUS_CLIENT_ID`
- `AMADEUS_CLIENT_SECRET`
- `GEMINI_API_KEY`
- optionally `GOOGLE_SEARCH_API_KEY`
- optionally `GOOGLE_SEARCH_ENGINE_ID`

Grant the runtime identity access only to these secrets. Prefer workload identity or a directly attached service account over downloadable JSON keys. Use separate credentials and projects for development and production.

## Required platform controls

- HTTPS at the public boundary.
- Exact CORS origins; never use `*` with a credentialed application.
- Request logs and error-rate monitoring without bodies, keys, prompts, tokens, or full provider responses.
- Budget and quota alerts for Gemini, Google Search, and Amadeus.
- A frontend rewrite from `/travel` to `index.html`.
- A restrictive Content Security Policy allowing the API origin and required image sources.
- Rolling deployment and rollback to the previous known-good build.

The built-in in-memory rate limiter and token cache are suitable for a single-instance baseline. A multi-instance production deployment should use a shared rate-limit store and accept that each instance maintains its own Amadeus token cache, or introduce an approved shared cache.
