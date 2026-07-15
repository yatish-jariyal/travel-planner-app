import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTravelInfoFromAI } from "../utils/getAPI";
import { getApiErrorMessage } from "../utils/apiClient";
import type { RootState } from "./store";

export interface Hotel {
  hotelName: string;
  stars: string;
  availability: string;
  price: string;
  description: string;
  location: string;
  ratings: string;
}

export interface Attraction {
  attractionName: string;
  description: string;
  location: string;
  entryFee: string;
  ratings: string;
  imageUrl: string;
  imageSourceName?: string;
  imageSourceUrl?: string;
}

export interface TravelDataResponse {
  hotels: Hotel[];
  attractions: Attraction[];
}

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

interface FetchTravelInfoArguments {
  destinationCity: string;
  startDate: string;
  endDate: string;
}

export const fetchTravelInfo = createAsyncThunk<
  TravelDataResponse,
  FetchTravelInfoArguments,
  { rejectValue: string }
>(
  "travel/fetchTravelInfo",
  async (data, { rejectWithValue }) => {
    try {
      return await getTravelInfoFromAI(
        data.destinationCity,
        data.startDate,
        data.endDate
      );
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
      .addCase(fetchTravelInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTravelInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotels = action.payload.hotels;
        state.attractions = action.payload.attractions;
      })
      .addCase(fetchTravelInfo.rejected, (state, action) => {
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
