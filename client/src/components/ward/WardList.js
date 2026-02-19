"use client";

import { useState } from "react";
import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
import ListDataTableCommon from "../common/table";
import { RowActions } from "../common/rowActions";

export default function WardList({ items, onEdit, onDelete }) {
  const WardActions = [
    { label: "Edit", icon: Edit2, handler: onEdit },
    {
      label: "Delete",
      icon: Trash2,
      danger: true,
      confirm: (row) => `Are you sure you want to delete ${row.name}?`,
      handler: (row) => onDelete(row.id),
    },
  ];
  const wardColumn = [
    {
      id: "serial_number",
      label: "क्र.स",
      render: (row, index) => index + 1,
    },
    {
      id: "number",
      label: "वडा.नं",
      key: "number",
    },
    {
      id: "ward_location",
      label: "ठेगाना",
      key: "ward_location",
    },
    {
      id: "actions",
      label: "⚙️ Action",
      render: (row) => <RowActions row={row} actions={WardActions} />,
    },
  ];
  
  if (!items || items.length === 0) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">No wards found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <ListDataTableCommon columns={wardColumn} data={items} />
    </div>
  );
}
