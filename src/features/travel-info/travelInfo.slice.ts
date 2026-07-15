import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { getApiErrorMessage } from "../../shared/api/apiClient";
import { fetchTravelInfo } from "./travelInfo.api";
import type {
  Attraction,
  Hotel,
  TravelInfoRequest,
  TravelInfoResult,
} from "../../../shared/api/contracts";

interface TravelState {
  hotels: Hotel[];
  attractions: Attraction[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TravelState = {
  hotels: [],
  attractions: [],
  status: "idle",
  error: null,
};

export const loadTravelInfo = createAsyncThunk<
  TravelInfoResult,
  TravelInfoRequest,
  { rejectValue: string }
>(
  "travel/loadTravelInfo",
  async (data, { rejectWithValue }) => {
    try {
      return await fetchTravelInfo(data);
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Unable to load hotels and attractions.")
      );
    }
  }
);

const travelSlice = createSlice({
  name: "travel",
  initialState,
  reducers: {
    clearTravelData: (state) => {
      state.hotels = [];
      state.attractions = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTravelInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadTravelInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotels = action.payload.hotels;
        state.attractions = action.payload.attractions;
      })
      .addCase(loadTravelInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ??
          action.error.message ??
          "Unable to load hotels and attractions.";
      });
  },
});

export const { clearTravelData } = travelSlice.actions;
export default travelSlice.reducer;

export const selectHotels = (state: RootState) => state.travel.hotels;
export const selectAttractions = (state: RootState) =>
  state.travel.attractions;
export const selectTravelStatus = (state: RootState) => state.travel.status;
export const selectTravelError = (state: RootState) => state.travel.error;
