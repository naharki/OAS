import { dispatch } from "./store";
import { fetchGlobalData } from "./slices/globalSlice";

export const loadGlobalData = () => {
  dispatch(fetchGlobalData());
};
