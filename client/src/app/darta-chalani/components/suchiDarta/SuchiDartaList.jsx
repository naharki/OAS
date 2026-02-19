"use client";
import { SuchiDartaListHeader } from "./SuchiDartaHeader";
import { useMemo } from "react";

import { use, useState } from "react";
import {
  Edit2,
  Trash2,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import { RowActions } from "../common/rowActions";
import ListDataTableCommon from "../common/table";

export default function SuchiDartaList({ data, onEdit, onDelete, onSuccess }) {
  const [openId, setOpenId] = useState(null);
  const [vatNumberFilter, setVatNumberFilter] = useState("");
  const [contactNumberFilter, setContactNumberFilter] = useState("");
  const [dartaNumberFilter, setDartaNumberFilter] = useState("");
  const [firmNameFilter, setFirmNameFilter] = useState("");

  const SuchidartaActions = [
    { label: "Edit", icon: Edit2, handler: onEdit },
    { label: "More Details", icon: FileText, handler: (row) => alert(`Viewing details for ${row.darta_number}`) },
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
      id: "firm_name",
      label: "Firm Name",
      key: "firm_name",
    },
    { id: "pan_Vat_number", label: "PAN/VAT Number", key: "pan_Vat_number" },
    {
      id: "firm_address",
      label: "Address",
      key: "firm_address",
    },
    {
      id: "contact_person",
      label: "Contact Person",
      key: "contact_person",
    },
    {
      id: "contact_number",
      label: "Contact",
      key: "contact_number",
    },
    {
      id: "actions",
      label: "⚙️ Action",
      render: (row) => (
        <RowActions
          row={row}
          actions={SuchidartaActions}
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
      const matchFirmName = darta.firm_name
        .toLowerCase()
        .includes(firmNameFilter.toLowerCase());
      const matchVatNumber = 
         vatNumberFilter === "" || 
         darta.pan_Vat_number === Number(vatNumberFilter);
      const matchContactNumber = darta.contact_number
        .toLowerCase()
        .includes(contactNumberFilter.toLowerCase());
      return matchDartaNumber && matchFirmName && matchVatNumber && matchContactNumber;
    });
  }, [data, dartaNumberFilter, firmNameFilter, vatNumberFilter, contactNumberFilter]);

  const handleResetFilters = () => {
    setDartaNumberFilter("");
    setFirmNameFilter("");
    setVatNumberFilter("");
    setContactNumberFilter("");
  };

  return (
    <div className="p-2">
      <SuchiDartaListHeader
        onSuccess={onSuccess}
        data={data}
        filterData={filteredData}
        dartaNumberFilter={dartaNumberFilter}
        setDartaNumberFilter={setDartaNumberFilter}
        firmNameFilter={firmNameFilter}
        setFirmNameFilter={setFirmNameFilter}
        vatNumberFilter={vatNumberFilter}
        setVatNumberFilter={setVatNumberFilter}
        contactNumberFilter={contactNumberFilter}
        setContactNumberFilter={setContactNumberFilter}
        onReset={handleResetFilters}
      />
      <ListDataTableCommon columns={columns} data={filteredData} />
    </div>
  );
}
