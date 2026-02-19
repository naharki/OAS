'use client';

import { useState } from 'react';

export default function PlanForm({ initial = {}, onSave, onCancel }) {
  const [group, setGroup] = useState(initial.group || '');
  const [type, setType] = useState(initial.type || '');
  const [wardNo, setWardNo] = useState(initial.ward_no || '');
  const [level, setLevel] = useState(initial.level || '');
  const [status, setStatus] = useState(initial.status || '');
  const [name, setName] = useState(initial.name || '');
  const [budget, setBudget] = useState(initial.budget || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: initial.id,
      group,
      type,
      ward_no: wardNo,
      level,
      status,
      name,
      budget,
    };
    onSave && onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="row gx-3">
        <div className="col-md-6">
          <div className="mb-2">
            <label className="form-label">योजना ग्रुप</label>
            <input value={group} onChange={(e) => setGroup(e.target.value)} className="form-control" />
          </div>
          <div className="mb-2">
            <label className="form-label">प्रकार</label>
            <input value={type} onChange={(e) => setType(e.target.value)} className="form-control" />
          </div>
          <div className="mb-2">
            <label className="form-label">वडा नं</label>
            <input value={wardNo} onChange={(e) => setWardNo(e.target.value)} className="form-control" />
          </div>
          <div className="mb-2">
            <label className="form-label">कार्यान्वयन तह</label>
            <input value={level} onChange={(e) => setLevel(e.target.value)} className="form-control" />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-2">
            <label className="form-label">योजना अवस्था</label>
            <input value={status} onChange={(e) => setStatus(e.target.value)} className="form-control" />
          </div>
          <div className="mb-2">
            <label className="form-label">योजनाको नाम</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
          </div>
          <div className="mb-2">
            <label className="form-label">बजेट</label>
            <input value={budget} onChange={(e) => setBudget(e.target.value)} className="form-control" />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
