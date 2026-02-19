'use client';

import { useState } from 'react';
import { useMemo } from 'react';
import { Edit2, Trash2, MoreHorizontal, Users, FileText, CreditCard, Lock } from 'lucide-react';
import { RowActions } from '../common/rowActions';

import ListDataTableCommon from '../common/table';
import { ChalaniListHeader } from './chalaniHeader';

export default function ChalaniList({ data, onEdit, onDelete , onSuccess}) {
  const [openId, setOpenId] = useState(null);
  const [chalaniNumberFilter, setChalaniNumberFilter] = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const [receiverFilter, setReceiverFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const chalaniActions = [
    { label: 'Edit', icon: Edit2, handler: onEdit },
    {
      label: 'Delete',
      icon: Trash2,
      danger: true,
      confirm: (row) => `Are you sure you want to delete चलानी नं : ${row.chalani_number}, ${row.letter_receiver}, ${row.subject}?`,
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
      id:'chalani_number',
      label:'चलानी नं',
      key:'chalani_number'
    },
      {
      id:'chalani_date',
      label:'चलानी मिति',
      key:'chalani_date'
    },
      {
      id:'letter_receiver',
      label:'पत्र पाउने कार्यालय/व्यक्ति',
      key:'letter_receiver'
    },
      {
      id:'subject',
      label:'बिषय',
      key:'subject'
    },
      {
      id:'sender_section',
      label:' पठाउने फाँट',
      key:'sender_section'
    }, 
    {
      id:'remarks',
      label:'कैफियत',
      key:'remarks'
    }, 
    {
      id: "actions",
      label: "⚙️ Action",
      render: (row) => <RowActions row={row} actions={chalaniActions} openId={openId} setOpenId={setOpenId}/>,
    },
  ]

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info">
        <p className="mb-0">No data found. Add one to get started.</p>
      </div>
    );
  }
    const filteredData = useMemo(() => {
      return data.filter((chalani) => {
        const matchChalaniNumber =
          chalaniNumberFilter === "" ||
          chalani.chalani_number === Number(chalaniNumberFilter);
        const matchesSender = chalani.sender_section
          .toLowerCase()
          .includes(senderFilter.toLowerCase());
          const matchesReceiver = chalani.letter_receiver
          .toLowerCase()
          .includes(receiverFilter.toLowerCase());
        const matchesSubject = chalani.subject
          .toLowerCase()
          .includes(subjectFilter.toLowerCase());
        return matchChalaniNumber && matchesSender && matchesReceiver && matchesSubject;
      });
    }, [data, chalaniNumberFilter, senderFilter,receiverFilter,  subjectFilter]);
  
    const handleResetFilters = () => {
      setChalaniNumberFilter("");
      setSenderFilter("");
      setSubjectFilter("");
      setReceiverFilter("");
    };

  return (
    <div className="p-3">
          <ChalaniListHeader
            onSuccess={onSuccess}
            data={data}
            filterData={filteredData}
            chalaniNumberFilter={chalaniNumberFilter}
            setChalaniNumberFilter={setChalaniNumberFilter}
            receiverFilter={receiverFilter}
            setReceiverFilter={setReceiverFilter}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            onReset={handleResetFilters}
          />
          <ListDataTableCommon columns={columns} data={filteredData} />
        </div>
    
  );
}

