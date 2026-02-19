"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (!token) {
      router.replace("/login");
    }
  }, []);

  return children;
}
