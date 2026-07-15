import { configureStore } from "@reduxjs/toolkit";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import flightsReducer, { loadFlights } from "../flights/flights.slice";
import travelReducer, { loadTravelInfo } from "../travel-info/travelInfo.slice";
import TravelResultsPage from "./TravelResultsPage";

const createTestStore = () =>
  configureStore({
    reducer: { travel: travelReducer, flights: flightsReducer },
  });

const renderResults = (store: ReturnType<typeof createTestStore>) =>
  renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/travel"]}>
        <TravelResultsPage />
      </MemoryRouter>
    </Provider>
  );

describe("TravelResultsPage", () => {
  it("shows a flight error while preserving successful travel results", () => {
    const store = createTestStore();
    store.dispatch({
      type: loadFlights.rejected.type,
      payload: "Flight service unavailable",
      error: { message: "Rejected" },
    });
    store.dispatch({
      type: loadTravelInfo.fulfilled.type,
      payload: { hotels: [], attractions: [] },
    });

    const html = renderResults(store);

    expect(html).toContain("Some results could not be loaded.");
    expect(html).toContain("Flight service unavailable");
    expect(html).toContain("Flights are unavailable");
  });

  it("distinguishes a successful empty flight result from a failure", () => {
    const store = createTestStore();
    store.dispatch({ type: loadFlights.fulfilled.type, payload: [] });
    store.dispatch({
      type: loadTravelInfo.fulfilled.type,
      payload: { hotels: [], attractions: [] },
    });

    const html = renderResults(store);

    expect(html).toContain("No flights available");
    expect(html).not.toContain("Some results could not be loaded.");
  });

  it("renders accessible tab and loading-state semantics", () => {
    const store = createTestStore();
    store.dispatch({ type: loadFlights.pending.type });
    store.dispatch({ type: loadTravelInfo.pending.type });

    const html = renderResults(store);

    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain("Loading flights…");
  });
});
