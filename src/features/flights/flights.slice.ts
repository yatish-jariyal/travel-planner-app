import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { getApiErrorMessage } from "../../shared/api/apiClient";
import { searchFlights } from "./flights.api";
import type { Flight, FlightSearchRequest } from "./flights.types";

interface FlightsState {
  flights: Flight[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FlightsState = {
  flights: [],
  status: "idle",
  error: null,
};

export const loadFlights = createAsyncThunk<
  Flight[],
  FlightSearchRequest,
  { rejectValue: string }
>(
  "flights/loadFlights",
  async (body, { rejectWithValue }) => {
    try {
      return await searchFlights(body);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Unable to load flights."));
    }
  }
);

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    clearFlightsData: (state) => {
      state.flights = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFlights.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadFlights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.flights = action.payload;
      })
      .addCase(loadFlights.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Unable to load flights.";
      });
  },
});

export const { clearFlightsData } = flightsSlice.actions;
export default flightsSlice.reducer;
export const selectFlights = (state: RootState) => state.flights;
export const selectFlightsStatus = (state: RootState) => state.flights.status;
export const selectFlightsError = (state: RootState) => state.flights.error;
