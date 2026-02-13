"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export const RowActions = ({
  row,
  actions,
  openId,
  setOpenId,
  onEdit,
  onDelete,
  onAction,
}) => {
  if (!actions.length) return null;
  const isOpen = openId === row.id;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => setOpenId(openId === row.id ? null : row.id)}
        title="Actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {openId === row.id && (
        <div
          className="card shadow-sm p-2"
          style={{
            position: "absolute",
            right: "110%",
            top: 0,
            minWidth: 200,
            zIndex: 2000,
          }}
        >
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                className={`btn btn-sm d-flex align-items-center w-100 mb-1 ${
                  action.danger ? "btn-danger" : "btn-light"
                }`}
                onClick={() => {
                  setOpenId(null);
                  if (action.confirm) {
                    if (confirm(action.confirm(row))) action.handler(row);
                  } else {
                    action.handler(row);
                  }
                }}
              >
                {Icon && <Icon size={14} className="me-2" />}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
