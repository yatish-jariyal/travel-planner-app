# Codebase Review

## Current architecture

The React client handles forms, Redux request state, and result rendering. It calls three project-owned routes:

- `GET /api/airports`
- `POST /api/flights/search`
- `POST /api/travel-info`

The Node/Express backend validates requests and owns all provider communication. SerpApi, Gemini, and optional Google Search credentials never cross the API boundary. Airport autocomplete reads a bundled OurAirports-derived index.

## Resolved high-priority findings

- Removed the hard-coded Google credential from current source.
- Moved every secret-bearing provider request out of the browser.
- Removed browser token cookies and legacy Google Generative AI SDK.
- Added resilient Gemini response normalization and optional image fallbacks.
- Added explicit loading, empty, partial, success, and error states.
- Added strict server validation, rate limits, timeouts, CORS, security headers, and sanitized errors.
- Added frontend/backend tests and CI release gates.
- Updated Gemini from the shut-down 1.5 Flash model to stable 3.5 Flash.
- Deleted the historically exposed Google API key and the unidentified
  user-managed service-account key after replacement-credential validation.

## Remaining risks

### Deployment architecture is provider-neutral

No hosting target has been chosen. Secret-manager integration, workload identity, HTTPS termination, route mapping, production CORS origins, monitoring, and rollback must be configured for the selected platform.

### In-memory controls are instance-local

Rate limits, the SerpApi search cache, and the complete travel-information cache
are process-local. They provide a secure baseline for personal and
single-instance use. Horizontally scaled deployment should use shared stores
and review provider quotas.

### Generated travel information is not inventory

Gemini suggestions cannot guarantee current hotel availability, pricing, ratings, or attraction fees. The UI and product language must preserve this distinction.

## Recommended next work

1. Select and configure the backend/frontend deployment platform.
2. Add deployment smoke tests, monitoring, and budget alerts.
3. Add user authentication only if the product requires per-user controls or saved trips.
4. Replace generated hotel data with a real inventory provider if booking-grade accuracy becomes a requirement.
