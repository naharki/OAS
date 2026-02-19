"use client";

import { useMemo, useState } from "react";
import {
  Handshake,
  DollarSign,
  User,
  CloudUpload,
  FileTextIcon,
} from "lucide-react";
import { useWards } from "@/hook/useWards";
import { PlanListHeader } from "./planListHeader";
import { Edit2, Trash2, Users } from "lucide-react";
import ListDataTableCommon from "../common/table";
import { RowActions } from "../common/rowActions";
import { useRouter } from "next/navigation";

export default function PlanList({ loading, error, data, onSuccess }) {
  const [openId, setOpenId] = useState(null);
  const { ward, loading: wardLoading } = useWards();
  const [wardFilter, setWardFilter] = useState("");
  const [nameFilter, setnameFilter] = useState("");

  const router = useRouter();
  const onAction = (type, row) => {
    router.push(`plan/${row.id}/${type}`);
  };

  const PlanActions = [
    {
      label: "कागजातहरुको सुची",
      icon: CloudUpload,
      handler: (row) => onAction("documents", row),
    },
    {
      label: "आयोजनाको इन्चार्ज",
      icon: User,
      handler: (row) => onAction("incharge", row),
    },
    {
      label: "लागत अनुमान",
      icon: DollarSign,
      handler: (row) => onAction("estimate", row),
    },
    {
      label: "कार्यान्वयन निकाय",
      icon: Users,
      handler: (row) => onAction("executer", row),
    },
    {
      label: "योजना सम्झौता",
      icon: Handshake,
      handler: (row) => onAction("contract", row),
    },
    {
      label: "सम्झौता टिप्पणी",
      icon: FileTextIcon,
      handler: (row) => onAction("contract_comment", row),
    },
    { label: "सम्पादन", icon: Edit2, handler: "edit" },
    {
      label: "मेटाउने",
      icon: Trash2,
      confirm: (row) => `Are you sure you want to delete ${row.name}?`,
      handler: (row) => onDelete(row.id),
    },
    { label: "योजनाको विष्तृत प्रतिवेदन", icon: Edit2, handler: "" },
  ];

  const PlanColumns = [
    {
      id: "serial_number",
      label: "क्र.स",
      render: (row, index) => index + 1,
    },
    {
      id: "registration_number",
      label: "दर्ता.नं",
      key: "registration_number",
    },
    {
      id: "plan_name",
      label: "आयोजनाको नाम",
      key: "plan_name",
    },
    {
      id: "ward_number",
      label: "वडा नं ",
      key: "ward_number",
    },
    {
      id: "location",
      label: "स्थान",
      key: "location",
    },
    {
      id: "allocated_budget",
      label: "विनियोजित बजेट ",
      key: "allocated_budget",
    },
    {
      id: "implementation_level",
      label: "कार्यान्वयनको तह ",
      key: "implementation_level",
    },
    {
      id: "implementation_status",
      label: "योजना अवस्था ",
      key: "implementation_status",
    },
    {
      id: "date",
      label: "मिति ",
      key: "date",
    },
    {
      id: "actions",
      label: "⚙️कार्य",
      render: (row) => (
        <RowActions
          row={row}
          actions={PlanActions}
          openId={openId}
          setOpenId={setOpenId}
        />
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return data.filter((plan) => {
      const matchesWard = wardFilter ? plan.ward_number === wardFilter : true;
      const matchesName = plan.plan_name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      return matchesWard && matchesName;
    });
  }, [data, wardFilter, nameFilter]);
  const handleResetFilters = () => {
    setWardFilter("");
    setnameFilter("");
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">योजनाहरू (Plans)</h4>
      </div>
      <PlanListHeader
        onSuccess={onSuccess}
        data={data}
        ward={ward}
        onApplyWard={setWardFilter}
        filterData={filteredData}
        setnameFilter={setnameFilter}
        nameFilter={nameFilter}
        onReset={handleResetFilters}
      />
      <ListDataTableCommon columns={PlanColumns} data={filteredData} />
    </div>
  );
}
