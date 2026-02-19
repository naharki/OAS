"use client";
import { Edit2, Trash2 } from "lucide-react";
import ListDataTableCommon from "../common/table";

export default function OfficeList({ offices, loading, onEdit, onDelete }) {
  const columns = [
    {
      id: "name",
      label: "Office Name",
      key: "name",
    },
    {
      id: "full_name",
      label: "Full Name",
      key: "full_name",
    },
    {
      id: "location",
      label: "Location",
      key: "location",
    },
    {
      id: "website",
      label: "Website",
      render: (row) => (
        <a href={row.website} target="_blank" className="text-decoration-none">
          {row.website}
        </a>
      ),
    },
    {
      id: "phone",
      label: "Contact",
      key: "phone_number",
    },
    {
      id: "actions",
      label: "⚙️ Actions",
      render: (row) => (
        <div className="text-center">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => onEdit(row)}
          >
            <Edit2 size={14} className="me-1" />
            Edit
          </button>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(row.id)}
          >
            <Trash2 size={14} className="me-1" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <ListDataTableCommon
      columns={columns}
      data={offices}
      loading={loading}
      emptyTitle="No Offices Found"
      emptyMessage='Click "Add New Office" to create your first record.'
    />
  );
}
