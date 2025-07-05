import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTravelInfoFromAI } from "../utils/getAPI";

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

export const fetchTravelInfo = createAsyncThunk(
  "travel/fetchTravelInfo",
  async (data: {
    destinationCity: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      const response = await getTravelInfoFromAI(
        data.destinationCity,
        data.startDate,
        data.endDate
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
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
        console.log("in redux", action.payload);
        state.status = "succeeded";
        state.hotels = action?.payload.hotels || [];
        state.attractions = action?.payload.attractions || [];
      })
      .addCase(fetchTravelInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { clearTravelData } = travelSlice.actions;
export default travelSlice.reducer;

export const selectHotels = (state: { travel: TravelState }) =>
  state.travel.hotels;
export const selectAttractions = (state: { travel: TravelState }) =>
  state.travel.attractions;
export const selectTravelStatus = (state: { travel: TravelState }) =>
  state.travel.status;
export const selectTravelError = (state: { travel: TravelState }) =>
  state.travel.error;
