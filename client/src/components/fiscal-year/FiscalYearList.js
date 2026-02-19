"use client";

import { useState } from "react";
import { Edit2, Trash2, MoreHorizontal, Users, FileText, CreditCard, Lock } from 'lucide-react';
import ListDataTableCommon from "../common/table";
import { RowActions } from "../common/rowActions";

export default function FiscalYearList({ items, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
 const committeeActions = [
    { label: 'Edit', icon: Edit2, handler: onEdit },
    {
      label: 'Delete',
      icon: Trash2,
      danger: true,
      confirm: (row) => `Are you sure you want to delete ${row.name}?`,
      handler: (row) => onDelete(row.id),
    },
  ];
  const columns = [
    {
      id:'serial_number',
      label:'क्र.स',
      render:(row, index) => index+1
    },
    {
      id:'name',
      label:'आ.व',
      key:'name'
    },
    {
      id:'eng_name',
      label:'अंग्रेजी नाम',
      key:'eng_name'
    },
    {
      id:'code',
      label:'कोड',
      key:'code'
    },
    {
      id:'start_year',
      label:'सुरु बर्ष',
      key:'start_year'
    },
    {
      id:'end_year',
      label:'अन्त्य बर्ष',
      key:'end_year'
    },
    {
      id:'start_date',
      label:'मितिदेखि',
      key:'start_date'
    },
    {
      id:'end_date',
      label:'मितिसम्म',
      key:'end_date'
    },
    {
      id:'action',
      label:'कार्य',
     render: (row) => <RowActions row={row} actions={committeeActions} />,
       
    }
  ]

  if (!items || items.length === 0) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">No fiscal years found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <ListDataTableCommon columns={columns} data={items}/>
    </div>
  );
}
