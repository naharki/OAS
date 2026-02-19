'use client';

import { useState } from 'react';
import { Edit2, Trash2, MoreHorizontal, Users, FileText, CreditCard, Lock } from 'lucide-react';
import { RowActions } from '../common/rowActions';
import ListDataTableCommon from '../common/table';

export default function DesignationList({ data, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);

  const designationActions = [
    { label: 'Edit', icon: Edit2, handler: onEdit },
    {
      label: 'Delete',
      icon: Trash2,
      danger: true,
      confirm: (row) => `Are you sure you want to delete ${row.title}?`,
      handler: (row) => onDelete(row.id),
    },
  ];
  const columns = [
    {
      id:'serial_number',
      label:'क्र.स',
      render: (row, index) => index + 1,
    },
    {
      id:'title',
      label:'नाम',
      key:'title'
    },
    
    {
      id:'english_title',
      label:'अङ्ग्रेजी नाम',
      key:'english_title'
    },
    {
      id:'view_order',
      label:'दृश्य क्रम',
      key:'view_order'
    },
    {
      id: "actions",
      label: "⚙️ Action",
      render: (row) => <RowActions row={row} actions={designationActions} openId={openId} setOpenId={setOpenId}/>,
    },
  ]

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">No data found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div >
      <ListDataTableCommon columns={columns} data={data} />
    </div>
  );
}

