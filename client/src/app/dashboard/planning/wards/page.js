"use client";
import { useState, useEffect } from "react";
import WardList from "@/components/ward/WardList";
import { wardsService } from "@/services/wardServices";

export default function WardsPage() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const response = await wardsService.list();
      setWards(response.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ward) => {
    // Handle edit
    console.log("Edit ward:", ward);
  };

  const handleDelete = (wardId) => {
    // Handle delete
    console.log("Delete ward:", wardId);
  };

  return (
    <div>
      <h1>Wards</h1>
      <WardList
        items={wards}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}