'use client';

import { useState } from 'react';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { RowActions } from '../common/rowActions';
import ListDataTableCommon from '../common/table';

export default function CommitteeTypeList({ types, onEdit, onDelete }) {
  const [openId, setOpenId] = useState(null);
  const committeeTypeActions = [
    { label: 'Edit', icon: Edit2, handler: onEdit },
    {
      label: 'Delete',
      icon: Trash2,
      danger: true,
      confirm: (row) => `Are you sure you want to delete ${row.name}?`,
      handler: (row) => onDelete(row.id),
    },
  ];

  const CommitteeTypesColumn = [
    {
      id:'serial_number',
      label:'क्र.स',
      render: (row, index) => index + 1,
    },
     {
      id:'name',
      label:'नाम',
      key: 'name'
    },
     {
      id:'eng_name',
      label:'अंग्रेजी नाम',
      key: 'eng_name'
    },
     {
      id:'code',
      label:'कोड',
      key: 'code'
    },
     {
      id:'action',
      label: "⚙️ Action",
      render: (row) => <RowActions row={row} actions={committeeTypeActions} />,
         }
  ]
  if (!types || types.length === 0) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">No committee types found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
     <ListDataTableCommon columns={CommitteeTypesColumn} data={types} />
    </div>
  );
}
