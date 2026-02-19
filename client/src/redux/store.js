// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./slices/globalSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export const dispatch = store.dispatch;
