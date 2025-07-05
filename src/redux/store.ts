import { configureStore } from "@reduxjs/toolkit";
import travelSlice from "./travelSlice";
import flightsSlice from "./flightsSlice";

const store = configureStore({
  reducer: { travel: travelSlice, flights: flightsSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
