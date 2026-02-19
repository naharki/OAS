// src/hooks/useOffice.js
"use client";
import { useSelector } from "react-redux";
import {
  selectWard,
  selectWardsLoaded,
  selectWardsLoading,
} from "@/redux/slices/globalSlice";

export const useWards = () => {
  const ward = useSelector(selectWard);
  const loading = useSelector(selectWardsLoading);

  return { ward, loading };
};
