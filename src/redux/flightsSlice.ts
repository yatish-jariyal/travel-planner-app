import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Flight, FlightArguments } from "./IFlights";
import { getData } from "../utils/getFlights";

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

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unable to load flights.";

export const fetchFlightsInfo = createAsyncThunk<
  Flight[],
  FlightArguments,
  { rejectValue: string }
>(
  "travel/fetchFlightsInfo",
  async (body, { rejectWithValue }) => {
    try {
      return await getData(body);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
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
      .addCase(fetchFlightsInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFlightsInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.flights = action.payload;
      })
      .addCase(fetchFlightsInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Unable to load flights.";
      });
  },
});

export const { clearFlightsData } = flightsSlice.actions;
export default flightsSlice.reducer;
export const selectFlights = (state: { flights: FlightsState }) =>
  state.flights;
export const selectFlightsStatus = (state: { flights: FlightsState }) =>
  state.flights.status;
export const selectFlightsError = (state: { flights: FlightsState }) =>
  state.flights.error;
