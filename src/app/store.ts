import { configureStore } from "@reduxjs/toolkit";
import flightsSlice from "../features/flights/flights.slice";
import travelInfoSlice from "../features/travel-info/travelInfo.slice";

const store = configureStore({
  reducer: { travel: travelInfoSlice, flights: flightsSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
