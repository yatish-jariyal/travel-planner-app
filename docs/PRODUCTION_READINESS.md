# Production Readiness

The application now has automated checks, explicit request states, runtime configuration validation, and a clean dependency audit. It is still a browser-only prototype and should not be deployed with private provider credentials until the backend work below is complete.

## Release gates

Every pull request and push to `main` runs the following GitHub Actions checks on Node 22:

```bash
npm ci
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

A production release should require all checks to pass and should be built from the committed lockfile.

## Blocking security work

- Confirm that the Google API key previously committed to Git history has been revoked or rotated.
- Move Amadeus token exchange, Gemini requests, and Google image search behind a project-owned backend or serverless API.
- Store provider credentials in the deployment platform's secret manager without a `VITE_` prefix.
- Apply authentication or abuse protection, rate limits, request size limits, timeouts, and structured server-side logging.
- Restrict provider credentials to the smallest required API and environment.

The current `.env` workflow protects local values from an ordinary Git commit but does not keep them out of browser bundles. See [Environment and Credential Setup](ENVIRONMENT_SETUP.md) for the target architecture.

## External API usage and quotas

One submitted trip can currently produce:

- Amadeus airport searches while the user types, after a 500 ms debounce.
- One Amadeus token exchange when no fresh cached token exists.
- One Amadeus flight-offer request.
- One Gemini generation request.
- Up to one Google image-search request per returned attraction when optional image enrichment is configured.

Provider quotas, rate limits, models, and pricing can change. Before each deployment:

1. Review the active quotas and billing limits in each provider account.
2. Set conservative provider-side budget and quota alerts.
3. Add backend rate limiting and cache airport, token, and image-search results where permitted.
4. Cap generated hotel and attraction counts and enforce response-size limits server-side.
5. Decide how partial provider outages should degrade the experience.

The application must not promise live hotel price, availability, attraction fee, or rating accuracy. Gemini output is generated guidance, not a booking inventory source.

## Hosting constraints

- Configure the host to rewrite unknown application paths such as `/travel` to `index.html` for React Router.
- Build with Node 22 and `npm ci`.
- Serve the site over HTTPS.
- Configure a restrictive Content Security Policy that allows only the required API and image origins after the backend design is finalized.
- Keep source maps private if they expose implementation details that should not be public.
- Validate CORS on the future backend and allow only approved application origins.
- Use separate test and production provider projects; do not point production at Amadeus test endpoints.

## Operational checklist

- Define uptime and error-rate monitoring for the frontend and future API.
- Log provider failures without logging tokens, keys, prompts containing sensitive data, or full provider responses.
- Add a privacy notice before collecting personal trip information or analytics.
- Test keyboard navigation, mobile layouts, slow networks, empty results, and partial outages before release.
- Document rollback steps and retain the previous known-good build.

## Current decision

The repository is suitable for continued development and controlled local testing. Production deployment remains blocked on provider-side key rotation confirmation and moving private credential operations out of the browser.
