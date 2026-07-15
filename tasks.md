# Travel Planner Task Tracker

This checklist mirrors the phased development plan. Check items only after the change has been implemented and verified on its own branch.

## PR 1 — Documentation roadmap (`docs/roadmap`)

- [x] Refresh the README to describe the current app and setup.
- [x] Add links to project planning documents.
- [x] Add a phased development plan.
- [x] Add a prioritized codebase review.
- [x] Document the branch and pull-request workflow.
- [x] Run lint.
- [x] Run the production build successfully.
- [x] Review the final documentation diff.
- [x] Commit, push, and open the documentation pull request.

## PR 2 — Travel-data reliability (`fix/travel-data-parsing`)

- [x] Extract Gemini response cleanup and parsing into a testable function.
- [x] Support plain JSON and Markdown-fenced JSON safely.
- [x] Validate `hotels` and `attractions` before using them.
- [x] Preserve valid travel data when attraction image lookup fails.
- [x] Handle an empty Google image-search result.
- [x] Move image-search configuration out of hard-coded source values.
- [x] Propagate useful rejected-thunk errors.
- [x] Add parser and fallback tests.
- [x] Verify lint, build, and tests.

## PR 3 — Environment and credential setup (`docs/env-setup`)

- [x] Rotate the exposed Google API credential.
- [x] Add `.env.example` containing placeholders only.
- [x] Document every required variable and how it is used.
- [x] Label which variables are required and which features are optional.
- [x] Document that `VITE_*` values are included in the browser bundle.
- [x] Choose and document a server-side strategy for private credentials.
- [x] Add clear handling for missing configuration.
- [x] Verify setup from a fresh clone.

## PR 4 — Result and error states (`fix/result-error-states`)

- [x] Stop the form loader after success, rejection, or validation failure.
- [x] Validate that both cities are selected.
- [x] Validate that the end date is not before the start date.
- [x] Show travel-suggestion request errors in the UI.
- [x] Show flight request errors in the UI.
- [x] Distinguish loading, empty, failed, and successful result states.
- [x] Support partial results when one service fails.
- [x] Prevent premature navigation away from the results page.
- [x] Verify keyboard and screen-reader behavior for tabs and errors.

## PR 5 — Production readiness (`chore/production-readiness`)

- [x] Remove development `console.log` calls.
- [x] Remove unused imports, dependencies, and empty markup.
- [x] Replace dynamic Tailwind class construction with complete class names.
- [x] Add typed `useAppDispatch` and `useAppSelector` hooks.
- [x] Add tests for the primary trip-search flow.
- [x] Add CI checks for lint, build, and tests.
- [x] Review responsive behavior and accessibility.
- [x] Document API limits and deployment constraints.
- [x] Complete a final security review before production deployment.

## PR 6 — Backend API and secret boundary (`feat/backend-api-proxy`)

- [x] Add a Node 22/Express backend owned by the project.
- [x] Move Amadeus token exchange and provider requests to the backend.
- [x] Cache Amadeus tokens server-side using provider expiry.
- [x] Move Gemini generation to the current server-side Google Gen AI SDK.
- [x] Replace the retired Gemini 1.5 model with stable Gemini 3.5 Flash.
- [x] Move optional Google image search to the backend.
- [x] Remove provider secrets, provider SDKs, and token cookies from browser code.
- [x] Validate inputs and reject unexpected fields.
- [x] Add payload limits, rate limits, timeouts, controlled CORS, and security headers.
- [x] Add sanitized structured errors and logs.
- [x] Add backend route, configuration, and parser tests.
- [x] Document local migration, deployment, and credential evidence.
- [x] Confirm the exposed Google API key was deleted in Google Cloud.
- [x] Classify and safely handle the unidentified active service-account key.
- [ ] Configure replacement credentials in the selected deployment secret manager.
- [x] Complete live-provider and browser-network verification with replacement credentials.

## PR 7 — Personal-project flight provider (`feat/serpapi-flight-search`)

- [x] Replace Amadeus authentication and flight requests with SerpApi Google Flights.
- [x] Replace provider-specific flight types with a normalized project contract.
- [x] Include both departure and return dates in flight searches.
- [x] Cache identical flight searches for 15 minutes.
- [x] Replace remote airport autocomplete with a local OurAirports index.
- [x] Limit the index to scheduled-service airports with IATA codes.
- [x] Remove active Amadeus configuration and provider code.
- [x] Add airport ranking, SerpApi normalization, cache, and route tests.
- [x] Add all-airports metro searches and canonical destination city names.
- [x] Verify one live SerpApi search without exposing the key.
- [x] Update environment, quota, attribution, and deployment documentation.
- [x] Complete the final form-to-results browser check manually.
