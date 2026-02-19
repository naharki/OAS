'use client';

import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const ROLE_OPTIONS = [
  { value: 'adhyaksha', label: 'अध्यक्ष' },
  { value: 'upadhyaksha', label: 'उपाध्यक्ष' },
  { value: 'sachiv', label: 'सचिव' },
  { value: 'kosadhyaksha', label: 'कोषाध्यक्ष' },
  { value: 'sadasya', label: 'सदस्य' },
  { value: 'anugaman', label: 'अनुगमन समिति' },
];

export default function TestingPage() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.role) {
      setError('नाम र भूमिका अनिवार्य छन्');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/members/`,
        formData
      );

      setSuccess(`सफलतापूर्वक सेभ भयो: ${res.data.role_label}`);
      setFormData({ name: '', role: '' });

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'डाटा सेभ गर्न समस्या आयो'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">सदस्य थप्नुहोस्</h5>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">नाम</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="पूरा नाम"
              />
            </div>

            {/* Role Select */}
            <div className="mb-3">
              <label className="form-label">भूमिका</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">-- भूमिका छान्नुहोस् --</option>
                {ROLE_OPTIONS.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Alerts */}
            {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'सेभ हुँदैछ...' : 'सेभ गर्नुहोस्'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
