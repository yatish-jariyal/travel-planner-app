# Production Readiness

The repository now has a project-owned API boundary. SerpApi flight search, Gemini generation, and optional Google image search execute only in the Node backend; the React bundle contains no provider credentials.

## Implemented controls

- Strict Zod schemas reject invalid and unexpected input fields.
- JSON request bodies are limited to 16 KB.
- API requests are rate-limited and return standard rate-limit headers.
- Provider clients have bounded timeouts.
- Identical SerpApi searches are cached for 15 minutes to conserve quota.
- Airport autocomplete uses a local public-domain OurAirports index.
- CORS allows only configured frontend origins.
- Helmet applies baseline HTTP security headers.
- Provider errors are sanitized and structured logs omit secrets and response bodies.
- Gemini uses the current `@google/genai` server SDK and stable `gemini-3.5-flash` model.
- CI checks frontend and backend lint, tests, builds, and dependency audit on Node 22.

## Remaining release blockers

- Confirm deletion of the Google API key historically committed to Git.
- Classify and safely disable/delete the unidentified active user-managed service-account key, if applicable.
- Store replacement credentials in the selected platform's secret manager.
- Select a deployment platform and configure HTTPS, routing, monitoring, budgets, rollback, and exact production CORS origins.
- Decide whether production scale requires a shared rate-limit store.

Track provider-side actions in [Credential Rotation Record](CREDENTIAL_ROTATION.md) and deployment requirements in [Backend Deployment](BACKEND_DEPLOYMENT.md).

## Release gates

```bash
npm ci
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

Also scan built browser assets:

```bash
rg 'VITE_(CLIENT_SECRET|GEMINI_API_KEY|GOOGLE_SEARCH_API_KEY)' src dist .env.example
rg 'AIza[0-9A-Za-z_-]+' src dist
```

Both scans must return no matches.

## Browser verification

Submit a trip with browser developer tools open. Browser traffic may call only the project's `/api/*` routes. It must not directly contact:

- `test.api.amadeus.com`
- `generativelanguage.googleapis.com`
- `www.googleapis.com/customsearch`

Test valid results, provider timeout, missing optional image configuration, invalid input, empty results, and one-provider failure with partial results.

## External API usage

One uncached submitted trip can produce one SerpApi flight request and one Gemini request. Airport searches run locally after a 500 ms debounce. Optional image enrichment can make one Google search per returned attraction.

The personal SerpApi plan currently allows 250 searches per month. Cached identical searches do not consume another project request while the 15-minute server entry remains valid. This is appropriate for personal development, not an assumption for a public production workload.

Generated hotel prices, availability, attraction fees, and ratings are guidance rather than live booking inventory. Review provider quotas, pricing, billing alerts, and model lifecycle before every release.

## Current decision

The code architecture is appropriate for controlled backend deployment. A public production launch remains blocked on the provider-side credential actions and hosting controls listed above.
