"use client";
import { DartaListHeader } from "./dartaHeader";
import { useMemo } from "react";

import { use, useState } from "react";
import {
  Edit2,
  Trash2,
  MoreHorizontal,
  Users,
  FileText,
  CreditCard,
  Lock,
} from "lucide-react";
import { RowActions } from "../common/rowActions";
import ListDataTableCommon from "../common/table";

export default function DartaList({ data, onEdit, onDelete, onSuccess }) {
  const [openId, setOpenId] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [senderFilter, setSenderFilter] = useState("");
  const [dartaNumberFilter, setDartaNumberFilter] = useState("");

  const dartaActions = [
    { label: "Edit", icon: Edit2, handler: onEdit },
    {
      label: "Delete",
      icon: Trash2,
      danger: true,
      confirm: (row) =>
        `Are you sure you want to delete ${row.darta_number}, ${row.letter_sender}, ${row.subject}?`,
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
      id: "darta_number",
      label: "दर्ता नं",
      key: "darta_number",
    },
    {
      id: "darta_date",
      label: "दर्ता मिति",
      key: "darta_date",
    },
    {
      id: "ref_number",
      label: "प्राप्त पत्रको प.स.च.न",
      key: "ref_number",
    },
    {id: "letter_date", label: "पत्र मिति", key: "letter_date"},
    {
      id: "letter_sender",
      label: "पत्र पठाउने कार्यालय/व्यक्ति",
      key: "letter_sender",
    },
    {
      id: "subject",
      label: "बिषय",
      key: "subject",
    },
    {
      id: "receiver_section",
      label: "फाँट",
      key: "receiver_section",
    },
    {
      id: "remarks",
      label: "कैफियत",
      key: "remarks",
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
    return data.filter((darta) => {
      const matchDartaNumber =
        dartaNumberFilter === "" ||
        darta.darta_number === Number(dartaNumberFilter);
      const matchesSender = darta.letter_sender
        .toLowerCase()
        .includes(senderFilter.toLowerCase());
      const matchesSubject = darta.subject
        .toLowerCase()
        .includes(subjectFilter.toLowerCase());
      return matchDartaNumber && matchesSender && matchesSubject;
    });
  }, [data, dartaNumberFilter, senderFilter, subjectFilter]);

  const handleResetFilters = () => {
    setDartaNumberFilter("");
    setSenderFilter("");
    setSubjectFilter("");
  };

  return (
    <div className="p-2">
      <DartaListHeader
        onSuccess={onSuccess}
        data={data}
        filterData={filteredData}
        dartaNumberFilter={dartaNumberFilter}
        setDartaNumberFilter={setDartaNumberFilter}
        senderFilter={senderFilter}
        setSenderFilter={setSenderFilter}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        onReset={handleResetFilters}
      />
      <ListDataTableCommon columns={columns} data={filteredData} />
    </div>
  );
}
