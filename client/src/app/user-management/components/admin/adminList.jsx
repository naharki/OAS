"use client";
import { AdminListHeader } from "./adminHeader";
import { useMemo } from "react";

import { use, useState } from "react";
import {
  Edit2,
  Trash2,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { RowActions } from "../common/rowActions";
import ListDataTableCommon from "../common/table";

export default function AdminList({ data, onEdit, onDelete, onSuccess }) {
  const [openId, setOpenId] = useState(null);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const dartaActions = [
    { label: "Edit", icon: Edit2, handler: onEdit },
    {
      label: "Delete",
      icon: Trash2,
      danger: true,
      confirm: (row) =>
        `Are you sure you want to delete ${row.username}, ${row.email}?`,
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
      id: "username",
      label: "प्रयोगकर्ता नाम",
      key: "username",
    },
    {
      id: "email",
      label: "ईमेल",
      key: "email",
    },
    {
      id: "password",
      label: "पासवर्ड",
      key: "password",
    },
   
    {
      id: "apps",
      label: "ऐप्स",
      key: "apps",
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
      const matchUsername = admin.username
        .toLowerCase()
        .includes(usernameFilter.toLowerCase());
      const matchEmail = admin.email
        .toLowerCase()
        .includes(emailFilter.toLowerCase());
      return matchUsername && matchEmail;
    });
  }, [data, usernameFilter, emailFilter]);

  const handleResetFilters = () => {
    setEmailFilter("");
    setUsernameFilter("");
  };

  return (
    <div className="p-2">
      <AdminListHeader
        onSuccess={onSuccess}
        data={data}
        filterData={filteredData}
        usernameFilter={usernameFilter}
        setUsernameFilter={setUsernameFilter}
        emailFilter={emailFilter}
        setEmailFilter={setEmailFilter}
        onReset={handleResetFilters}
      />
      <ListDataTableCommon columns={columns} data={filteredData} />
    </div>
  );
}
