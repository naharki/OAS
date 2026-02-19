// src/redux/loadGlobalData.js
import { fetchGlobalOffice } from "./slices/globalSlice";
import { fetchGlobalWards } from "./slices/globalSlice";
import { store } from "./store";

//load global data only once
export const loadGlobalOffice = () => {
  const { loaded, loading } = store.getState().global;

  if (!loaded && !loading) {
    store.dispatch(fetchGlobalOffice());
  }
};

export const loadGlobalWards = () => {
  const { loaded, loading } = store.getState().global;
  if (!loaded && !loading) {
    store.dispatch(fetchGlobalWards());
  }
};
