'use client';

import { useState, useEffect } from 'react';

export default function CommitteeForm({ onSubmit, initialData = null, onCancel = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      reg_no: '',
      name: '',
      committee_type: '',
      address: '',
      formation_date: '',
    }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reg_no.trim()) {
      alert('Registration number is required');
      return;
    }
    if (!formData.name.trim()) {
      alert('Committee name is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        reg_no: formData.reg_no.trim(),
        name: formData.name.trim(),
        committee_type: formData.committee_type.trim(),
        address: formData.address.trim(),
        formation_date: formData.formation_date,
      });
      if (!initialData) {
        setFormData({ reg_no: '', name: '', committee_type: '', address: '', formation_date: '' });
      }
    } catch (err) {
      console.error('CommitteeForm submit error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Reg. No</label>
          <input name="reg_no" className="form-control" value={formData.reg_no} onChange={handleChange} placeholder="e.g., REG-001" required />
        </div>
        <div className="col-md-8 mb-3">
          <label className="form-label">Committee Name</label>
          <input name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="Committee Name" required />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Committee Type</label>
          <input name="committee_type" className="form-control" value={formData.committee_type} onChange={handleChange} placeholder="Type (e.g., Technical)" />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Formation Date</label>
          <input name="formation_date" type="date" className="form-control" value={formData.formation_date} onChange={handleChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <input name="address" className="form-control" value={formData.address} onChange={handleChange} placeholder="Address" />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Committee' : 'Add Committee'}
      </button>
      {onCancel && (
        <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}