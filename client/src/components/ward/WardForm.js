'use client';

import { useState, useEffect } from 'react';

export default function WardForm({ onSubmit, initialData = null, onCancel = null }) {
  const [formData, setFormData] = useState({
    number: '',
    location: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Populate form on edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        number: initialData.number ?? '',
        location: initialData.ward_location ?? '',
      });
    } else {
      setFormData({ number: '', location: '' });
    }
    setErrors({});
    setServerError('');
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!String(formData.number).trim()) {
      newErrors.number = 'Ward number is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Ward location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setLoading(true);

      await onSubmit({
        number: Number(formData.number),
        ward_location: formData.location.trim(),
      });

      if (!initialData) {
        setFormData({ number: '', location: '' });
      }
    } catch (err) {
      console.error('WardForm submit error', err);

      // Handle Django/Backend validation errors
      if (err?.response?.data) {
        const data = err.response.data;

        if (typeof data === 'object') {
          const fieldErrors = {};
          Object.entries(data).forEach(([key, val]) => {
            fieldErrors[key === 'ward_location' ? 'location' : key] =
              Array.isArray(val) ? val[0] : val;
          });
          setErrors(fieldErrors);
        } else {
          setServerError(data);
        }
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">

      {/* Server Error */}
      {serverError && (
        <div className="alert alert-danger py-2">{serverError}</div>
      )}

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Ward Number</label>
          <input
            name="number"
            type="number"
            className={`form-control ${errors.number ? 'is-invalid' : ''}`}
            value={formData.number}
            onChange={handleChange}
            placeholder="Ward no."
          />
          {errors.number && (
            <div className="invalid-feedback">{errors.number}</div>
          )}
        </div>

        <div className="col-md-8 mb-3">
          <label className="form-label">Location</label>
          <input
            name="location"
            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Pokhara"
          />
          {errors.location && (
            <div className="invalid-feedback">{errors.location}</div>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Ward' : 'Add Ward'}
      </button>

      {onCancel && (
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
