// src/redux/slices/globalSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Fetch Office
export const fetchGlobalOffice = createAsyncThunk(
  "global/fetchOffice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("offices/");
      return response.data.data[0];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to load office data"
      );
    }
  }
);

// Fetch Wards
export const fetchGlobalWards = createAsyncThunk(
  "global/fetchWards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("wards/");
      return response.data.data.map((ward) => ({
        id: ward.id,
        number: ward.number,
      }));
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load wards");
    }
  }
);

const initialState = {
  office: null,
  wards: [],
  officeLoading: false,
  wardsLoading: false,
  officeLoaded: false,
  wardsLoaded: false,
  error: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    resetGlobalState(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // OFFICE
    builder
      .addCase(fetchGlobalOffice.pending, (state) => {
        state.officeLoading = true;
        state.error = null;
      })
      .addCase(fetchGlobalOffice.fulfilled, (state, action) => {
        state.officeLoading = false;
        state.officeLoaded = true;
        state.office = action.payload;
      })
      .addCase(fetchGlobalOffice.rejected, (state, action) => {
        state.officeLoading = false;
        state.error = action.payload;
      })

      // WARDS
      .addCase(fetchGlobalWards.pending, (state) => {
        state.wardsLoading = true;
        state.error = null;
      })
      .addCase(fetchGlobalWards.fulfilled, (state, action) => {
        state.wardsLoading = false;
        state.wardsLoaded = true;
        state.wards = action.payload;
      })
      .addCase(fetchGlobalWards.rejected, (state, action) => {
        state.wardsLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectOffice = (state) => state.global.office;
export const selectWard = (state) => state.global.wards;

export const selectOfficeLoading = (state) => state.global.officeLoading;
export const selectWardsLoading = (state) => state.global.wardsLoading;

export const selectOfficeLoaded = (state) => state.global.officeLoaded;
export const selectWardsLoaded = (state) => state.global.wardsLoaded;

export const { resetGlobalState } = globalSlice.actions;
export default globalSlice.reducer;
