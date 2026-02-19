'use client';

import { useState, useEffect } from 'react';

export default function CommitteeTypeForm({ onSubmit, initialData = null, onCancel = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      name : '',
      eng_name : '',
      code: '',
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
    if (!formData.name.trim()) {
      alert('Committee Type is required');
      return;
    }
    if (!formData.eng_name.trim()) {
      alert('English Name is required');
      return;
    }
    if (!formData.code.trim()) {
      alert('Code is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        name: formData.name.trim(),
        eng_name: formData.eng_name,
        code: formData.code,
      });
      if (!initialData) {
        setFormData({ name: '', eng_name : '', code: '' });
      }
    } catch (err) {
      console.error('FiscalYearForm submit error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">नाम</label>
          <input
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder=""
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">अंग्रेजी नाम</label>
          <input
            name="eng_name"
            className="form-control"
            value={formData.eng_name}
            onChange={handleChange}
            placeholder=""
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">कोड</label>
          <input name='code'
            className="form-control"
            value={formData.code}
            onChange={handleChange}
            placeholder=""
          />
        </div>
      </div>
      
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Committee Type' : 'Add Committee Type'}
      </button>
      {onCancel && (
        <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
