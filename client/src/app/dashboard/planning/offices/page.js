"use client";
import { useState, useEffect } from "react";
import OfficeList from "@/components/office/OfficeList";
import { OfficeService } from "@/services/officeServices";

export default function OfficesPage() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const response = await OfficeService.list();
      setOffices(response.data);
    } catch (error) {
      console.error("Error fetching offices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (office) => {
    // Handle edit
    console.log("Edit office:", office);
  };

  const handleDelete = (office) => {
    // Handle delete
    console.log("Delete office:", office);
  };

  return (
    <div>
      <h1>Offices</h1>
      <OfficeList
        offices={offices}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}