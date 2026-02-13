"use client";

import { Edit2, Trash2 } from "lucide-react";

export default function ListDataTableCommon({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  emptyTitle = "No Data Found",
  emptyMessage = "Please add data to get started.",
}) {
  console.log(data)
  // 🔄 Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // 📭 Empty state
  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info text-center py-5 mb-0">
        <h5 className="mb-2">📭 {emptyTitle}</h5>
        <p className="mb-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-responsive"style={{ height: "57vh" }}>
      <table className="table table-striped table-hover table-bordered mb-0">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.id}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={row.id ?? index}>
              {columns.map((col) => (
                <td key={col.id} className="px-3 py-2 align-middle">
                  {col.render ? (
                    col.render(row, index)
                  ) : col.key ? (
                    row[col.key]
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
