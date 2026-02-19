"use client";
import { useState, useEffect } from "react";
import { OfficeService } from "@/services/officeServices";

export default function Header() {
  const [officeData, setOfficeData] = useState({
    name: "Loading...",
    office: "Loading...",
    location: "Loading...",
    logoLeft: "",
    logoRight: "",
  });

  useEffect(() => {
    OfficeService.list().then((res) => {
        const office = res.data.data[0]; 

        setOfficeData({
          name: office.name,
          office: office.full_name,
          location: office.location,
          logoLeft: office.nishan_chap,   
          logoRight: office.office_logo,  
        });
      })
      .catch((err) => {
        console.error("Failed to fetch office data", err);
      });
  }, []);

  return (
    <div
      className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom"
      style={{ padding: "0 40px" }}
    >
      {/* Left Logo */}
      {officeData.logoLeft && (
        <img
          src={officeData.logoLeft || ''}
          alt="Nishan Chap"
          width={80}
          height={80}
          style={{ objectFit: "contain" }}
        />
      )}

      {/* Center Text */}
      <div className="text-center flex-grow-1 mx-3">
        <h2 className="mb-0">{officeData.name}</h2>
        <p className="mb-0">{officeData.office}</p>
        <p className="mb-0">{officeData.location}</p>
      </div>

      {/* Right Logo */}
      {officeData.logoRight && (
        <img
          src={officeData.logoRight || ''}
          alt="Office Logo"
          width={80}
          height={80}
          style={{ objectFit: "contain" }}
        />
      )}
    </div>
  );
}
