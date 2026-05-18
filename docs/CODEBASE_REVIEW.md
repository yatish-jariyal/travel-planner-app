# Codebase Review: Incomplete Areas & Improvement Opportunities

## Incomplete / Risky Parts

1. **Secrets are hardcoded in client code (critical).**
   `src/utils/getAPI.ts` includes a Google API key and custom search engine ID directly in frontend code. This is exposed to all users in browser bundles and should be moved server-side or behind a secure proxy.

2. **Travel form loader can get stuck indefinitely.**
   In `src/components/travelForm/TravelForm.tsx`, `setLoading(true)` is called before async actions, but `setLoading(false)` is never called in success or failure paths.

3. **Flight thunk error handling is incomplete.**
   In `src/redux/flightsSlice.ts`, `fetchFlightsInfo` catches errors and only logs them without rethrowing or using `rejectWithValue`. That can cause fulfilled actions with `undefined` payloads instead of proper rejected states.

4. **City search uses stale query variable instead of the current input argument.**
   In `src/components/common/CitySearch.tsx`, `fetchCities(searchQuery)` calls `getAirport(query)` instead of `getAirport(searchQuery)`, which can produce stale or incorrect API requests under rapid typing.

5. **Dynamic Tailwind class names may not compile reliably.**
   `src/components/common/TravelTabs.tsx` uses template classes like `text-${tab.activeColor}` and `bg-${tab.indicatorColor}`. Tailwind may not include these in generated CSS unless safelisted or converted to static class maps.

6. **AI response parsing has fragile assumptions.**
   `src/utils/getAPI.ts` assumes JSON appears in a very specific candidate path and format. If the model output changes even slightly, parsing fails.

7. **Sequential attraction image requests can cause slow UX and quota pressure.**
   `src/utils/getAPI.ts` fetches image URLs in a loop with `await` each time, making 10+ serial network calls and increasing total wait time.

8. **Production behavior tied to `console.log` debugging.**
   Multiple files log sensitive or noisy runtime data (`travelSlice`, `flightsSlice`, `TravelForm`, `getFlights`). Should be removed or gated by environment.

## Improvements (Prioritized)

### High Priority

- **Introduce a backend BFF/API layer** for Amadeus + Gemini + image search requests and keep secrets server-side.
- **Fix loading lifecycle in `TravelForm`** using `finally { setLoading(false); }` and explicit error UI for users.
- **Normalize thunk error handling** with `rejectWithValue` and strongly typed error payloads.
- **Replace dynamic Tailwind strings** with deterministic class maps.

### Medium Priority

- **Add runtime validation** for AI JSON using schema validation (e.g., Zod).
- **Improve API resilience** with retry/backoff and per-request timeout configuration.
- **Parallelize image lookups safely** (e.g., `Promise.allSettled` with concurrency control).
- **Use `RootState` in selectors** instead of inline `{ travel: TravelState }`/`{ flights: FlightsState }` types.

### Low Priority

- **Improve accessibility** in custom dropdown: keyboard navigation, roles, active option management.
- **Add tests**:
  - unit tests for payload builders and reducers,
  - component tests for form + city search,
  - integration tests for end-to-end travel flow with mocked APIs.
- **Document environment requirements** (`.env.example`) and API limits/failure modes.

## Suggested Next Steps

1. Remove exposed keys and move third-party calls server-side.
2. Patch form loading/error behavior and fix stale query bug.
3. Harden redux async flows and selector typing.
4. Add schema validation + tests before feature expansion.
