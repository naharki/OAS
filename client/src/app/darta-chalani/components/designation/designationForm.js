'use client';

import { useState, useEffect } from 'react';

export default function DesignationForm({ onSubmit, initialData = null, onCancel = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      english_title: '',
      view_order: '',
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
    if (!formData.title.trim()) {
      alert('Designation is required');
      return;
    }
    if (!formData.english_title.trim()) {
      alert('English Name in is required');
      return;
    }
    if (!formData.view_order) {
      alert('View Order is required');
      return;
    }


    try {
      setLoading(true);
      await onSubmit({
        title: formData.title.trim(),
        english_title: formData.english_title.trim(),
        view_order: formData.view_order,
      });
      if (!initialData) {
        setFormData({ title: '', english_title: '', view_order: '' });
      }
    } catch (err) {
      console.error('Designation Form submit error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-8 mb-3">
          <label className="form-label">पद</label>
          <input name="title" className="form-control" value={formData.title} onChange={handleChange} placeholder="e.g.,प्रमुख प्रशासकीय अधिकृत" required />
        </div>
      </div>
      <div className="col-md-8 mb-3">
          <label className="form-label">अङ्ग्रेजी नाम</label>
          <input name="english_title" className="form-control" value={formData.english_title} onChange={handleChange} placeholder="e.g, Chief Administrative Officer" required />
        </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">हेर्ने क्रम</label>
          <input name="view_order" type='number' className="form-control" value={formData.view_order} onChange={handleChange} placeholder="View Order" required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Formation Date</label>
          <input name="formation_date" type="date" className="form-control disable" value={formData.formation_date} onChange={handleChange} disabled/>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Designation' : 'Add Designation'}
      </button>
      {onCancel && (
        <button type="button" className="btn btn-da ms-2" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}