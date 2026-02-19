"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function SignatureCao() {
  const [caoName, setCaoName] = useState("Loading...");

  useEffect(() => {
    // Dummy API (replace this with your actual API later)
    axios
      .get("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => {
        // Using name from dummy API as CAO name
        setCaoName(res.data.name || "CAO Name");
      })
      .catch((err) => {
        console.error("Failed to fetch CAO name", err);
        setCaoName("CAO Name");
      });
  }, []);

  return (
    <div className="d-flex justify-content-end" style={{ marginTop: "60px" }}>
      <div style={{ textAlign: "center", marginRight: "50px" }}>
        <div
          style={{
            borderBottom: "1px dotted black",
            width: "200px",
            marginBottom: "5px",
          }}
        ></div>
        <span>{caoName}</span>
      </div>
    </div>
  );
}