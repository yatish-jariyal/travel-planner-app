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

export const fetchFlightsInfo = createAsyncThunk(
  "travel/fetchFlightsInfo",
  async (body: FlightArguments) => {
    try {
      const response = await getData(body);
      console.log("redux response", response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

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
        console.log("in redux", action.payload);
        state.status = "succeeded";
        state.flights = action?.payload || [];
      })
      .addCase(fetchFlightsInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default flightsSlice.reducer;
export const selectFlights = (state: { flights: FlightsState }) =>
  state.flights;
