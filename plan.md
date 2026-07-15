# Travel Planner Development Plan

## Goal

Turn the current prototype into a reliable, secure, maintainable travel-planning application while keeping changes small enough to review and verify independently.

## Guiding principles

- Keep each pull request focused on one outcome.
- Fix user-facing reliability before visual polish.
- Never store private API credentials in browser code or version control.
- Make loading, empty, success, and failure states explicit.
- Add automated coverage around parsing and state transitions before large refactors.

## Roadmap

### Phase 1 — Document the baseline

**Branch:** `docs/roadmap`

**Outcome:** Contributors can understand the project, its risks, and the planned order of work.

- Refresh the README to match the current application.
- Record the codebase architecture and prioritized findings.
- Add a phased plan and an actionable task tracker.
- Document a focused branch, commit, and pull-request workflow.

**Done when:** The documentation is internally consistent, contains no secrets, and all links resolve.

### Phase 2 — Make travel suggestions reliable

**Suggested branch:** `fix/travel-data-parsing`

**Outcome:** Valid hotel and attraction data is preserved even when AI formatting or image enrichment is imperfect.

- Normalize Gemini responses before parsing Markdown-fenced or plain JSON.
- Validate the parsed response shape and default missing collections safely.
- Separate attraction image enrichment from travel-data generation.
- Make image lookup optional and resilient to missing results or request failures.
- Return useful, typed errors from async thunks.
- Add focused tests for response parsing and enrichment fallbacks.

**Done when:** Hotels and attractions render from valid AI data, and an image-search failure cannot erase otherwise valid suggestions.

### Phase 3 — Secure and document configuration

**Suggested branch:** `docs/env-setup` for documentation, followed by a dedicated security implementation branch if a backend/proxy is introduced.

**Outcome:** Setup is reproducible and secrets are not hard-coded or presented as safe to expose in a browser bundle.

- Remove the hard-coded Google API key and search-engine identifier from source.
- Rotate any credential that has been committed or shared.
- Add `.env.example` with placeholder values only.
- Document required and optional services and their setup.
- Decide on a server-side proxy or backend for secret-bearing Amadeus and Google requests.
- Fail fast with clear configuration messages when required values are absent.

**Done when:** No live secret exists in tracked source, setup variables are documented, and production secrets are handled outside the client bundle.

### Phase 4 — Improve result and form states

**Suggested branch:** `fix/result-error-states`

**Outcome:** Users always understand whether a search is loading, empty, successful, or failed.

- Derive the form loading state from dispatched request outcomes.
- Ensure loading stops on validation failures and rejected requests.
- Display meaningful errors for flight and travel-suggestion failures.
- Allow partial results when only one external service fails.
- Validate city selection and date ranges before sending requests.
- Avoid redirecting away from the results page merely because arrays are empty while a request is pending or failed.

**Done when:** Every request path ends in a visible and recoverable UI state.

### Phase 5 — Cleanup and production readiness

**Suggested branch:** `chore/production-readiness`

**Outcome:** The project is easier to change safely and is ready for deployment decisions.

- Remove debugging logs and unused imports or dependencies.
- Replace dynamically constructed Tailwind class names with statically discoverable classes.
- Introduce typed Redux hooks and consistent error serialization.
- Add component/integration tests for the primary search flow.
- Add continuous integration for lint, build, and tests.
- Review accessibility, responsive layout, API quotas, and deployment architecture.

**Done when:** Automated checks pass, the main journey is covered, and remaining production limitations are documented.

### Phase 6 — Establish the backend security boundary

**Branch:** `feat/backend-api-proxy`

**Outcome:** No secret-bearing provider request or credential is delivered to the browser.

- Add a portable Node 22/Express API in the repository.
- Expose validated airport, flight-search, and travel-information routes.
- Move Amadeus authentication, Gemini generation, and optional image search server-side.
- Use the current Google Gen AI SDK and a supported stable model.
- Add rate limits, payload limits, provider timeouts, controlled CORS, security headers, and sanitized logging.
- Replace frontend provider calls with calls to the project API.
- Remove legacy browser secrets, SDKs, and token cookies.
- Document secret-manager deployment and provider-side rotation evidence.

**Done when:** Automated checks and bundle-secret scans pass, the browser contacts only project-owned API routes, and provider-side credential actions are recorded without secret values.

### Phase 7 — Use a personal-project flight provider

**Branch:** `feat/serpapi-flight-search`

**Outcome:** Flight and airport search work without an Amadeus account while remaining replaceable for a future public launch.

- Search scheduled-service airports from a local OurAirports-derived index.
- Search round-trip Google Flights results through server-side SerpApi.
- Normalize provider output into a project-owned flight contract.
- Cache identical searches to conserve the 250-search personal free tier.
- Remove Amadeus code and configuration.
- Add provider, cache, airport-search, and route coverage.
- Document public-data attribution, quota limits, and future provider replacement.

**Done when:** A live SerpApi request returns normalized INR results, airport search makes no external request, automated checks pass, and the browser key remains server-only.

## Pull-request standard

Each pull request should include:

- A short problem statement and the intended behavior.
- A focused diff without unrelated formatting or cleanup.
- Verification steps and their results.
- Screenshots for visible UI changes.
- Notes about configuration, migrations, or follow-up work.

Before requesting review, run at least:

```bash
npm run lint
npm run build
```

Add the test command once automated tests are introduced.
