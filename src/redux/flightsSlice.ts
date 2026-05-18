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

export const fetchFlightsInfo = createAsyncThunk<
  Flight[],
  FlightArguments,
  { rejectValue: string }
>("travel/fetchFlightsInfo", async (body, { rejectWithValue }) => {
  try {
    const response = await getData(body);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch flights"
    );
  }
});

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlightsInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFlightsInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.flights = action.payload || [];
      })
      .addCase(fetchFlightsInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message || "Something went wrong";
      });
  },
});

export default flightsSlice.reducer;
import type { RootState } from "./store";

export const selectFlights = (state: RootState) => state.flights;
