"use client";
import { AdminListHeader, AppsHeader } from "./appsHeader";
import { useMemo } from "react";
import { use, useState } from "react";
import {
  Edit2,
  Trash2,
} from "lucide-react";
import { RowActions } from "../common/rowActions";
import ListDataTableCommon from "../common/table";

export default function AppsList({ data, onEdit, onDelete, onSuccess }) {
  const [openId, setOpenId] = useState(null);
  const [appsnameFilter, setAppsnameFilter] = useState("");

  const dartaActions = [
    { label: "Edit", icon: Edit2, handler: onEdit },
    {
      label: "Delete",
      icon: Trash2,
      danger: true,
      confirm: (row) =>
        `Are you sure you want to delete ${row.name} ?`,
      handler: (row) => onDelete(row.id),
    },
  ];
  const columns = [
    {
      id: "serial_number",
      label: "क्र.स",
      render: (row, index) => index + 1,
    },
    {
      id: "name",
      label: "ऐप्स नाम",
      key: "name",
    },
    {
      id: "actions",
      label: "⚙️ Action",
      render: (row) => (
        <RowActions
          row={row}
          actions={dartaActions}
          openId={openId}
          setOpenId={setOpenId}
        />
      ),
    },
  ];

  // if (!data || data.length === 0) {
  //   return (
  //     <div className="alert alert-info">
  //       <p className="mb-0">No data found. Add one to get started.</p>
  //     </div>
  //   );
  // }

const filteredData = useMemo(() => {
    return data.filter((admin) => {
      const matchAppsname = admin.name
        .toLowerCase()
        .includes(appsnameFilter.toLowerCase());
      return matchAppsname;
    });
  }, [data, appsnameFilter]);

  const handleResetFilters = () => {
    setAppsnameFilter("");
  };

  return (
    <div className="p-2">
      <AppsHeader
        onSuccess={onSuccess}
        data={data}
        filterData={filteredData}
        appsnameFilter={appsnameFilter}
        setAppsnameFilter={setAppsnameFilter}
        onReset={handleResetFilters}
      />
      <ListDataTableCommon columns={columns} data={filteredData} />
    </div>
  );
}
