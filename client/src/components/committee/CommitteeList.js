'use client';

import { useState } from 'react';
import { Edit2, Trash2, MoreHorizontal, Users, FileText, CreditCard, Lock } from 'lucide-react';
import { RowActions } from '../common/rowActions';
import ListDataTableCommon from '../common/table';

export default function CommitteeList({ data, onEdit, onDelete, onAction }) {
  const [openId, setOpenId] = useState(null);
  
  const committeeActions = [
    { label: 'Members', icon: Users, handler: (row) => onAction('members', row) },
    { label: 'Certificate', icon: FileText, handler: (row) => onAction('certificate', row) },
    { label: 'Account Open', icon: CreditCard, handler: (row) => onAction('account_open', row) },
    { label: 'Account Closed', icon: Lock, handler: (row) => onAction('account_closed', row) },
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
      render: (row, index) => index + 1,
    },
    {
      id:'register_number',
      label:'दर्ता.नं',
      key:'register_number'
    },
    {
      id:'name',
      label:'समितिको नाम',
      key:'name'
    },
    {
      id:'committee_type',
      label:'समितिको प्रकार',
      render: (row) => row.committeeType?.name || '-'
    },
    {
      id:'address',
      label:'ठेगाना',
      key:'address'
    },
    {
      id:'created_date',
      label:'गठन मिति ',
      key:'created_date'
    },
    {
      id: "actions",
      label: "⚙️ Action",
      render: (row) => <RowActions row={row} actions={committeeActions} openId={openId} setOpenId={setOpenId}/>,
    },
  ]

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">No committees found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div >
      <ListDataTableCommon columns={columns} data={data} />
    </div>
  );
}

