'use client';

import { useState, useEffect } from 'react';
import OfficeList from '@/components/office/OfficeList';
import OfficeForm from '@/components/office/OfficeForm';
import { OfficeService } from '@/services/officeServices';

export default function OfficePage() {
  const [offices, setOffices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const response = await OfficeService.list();
      console.log(response)
      setOffices(response.data.data);
    } catch (error) {
      console.error('Error fetching offices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (office) => {
    try {
      if (selectedOffice) {
        await OfficeService.update(selectedOffice.id, office);
      } else {
        await axios.post(API_URL, office);
      }
      setShowForm(false);
      setSelectedOffice(null);
      fetchOffices();
    } catch (error) {
      console.error('Error saving office:', error);
      alert('Error saving office');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchOffices();
      } catch (error) {
        console.error('Error deleting office:', error);
        alert('Error deleting office');
      }
    }
  };

  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">📋 Office Management</h1>
            <p className="text-secondary mb-0">Manage and organize office information</p>
          </div>
          <button
            onClick={() => {
              setSelectedOffice(null);
              setShowForm(!showForm);
            }}
            className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-primary'} btn-lg`}
            style={{ borderRadius: '8px' }}
          >
            {showForm ? '✕ Cancel' : '➕ Add New Office'}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="mb-4">
            <div className="card shadow-sm" style={{ borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <div className="card-header bg-light border-bottom">
                <h5 className="mb-0 text-dark fw-bold">
                  {selectedOffice ? '✏️ Edit Office' : '🆕 New Office'}
                </h5>
              </div>
              <div className="card-body">
                <OfficeForm office={selectedOffice} onSave={handleSave} />
              </div>
            </div>
          </div>
        )}

        {/* List Section */}
        <div className="card shadow-sm" style={{ borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-dark fw-bold">📊 Offices List</h5>
            <span className="badge bg-primary">{offices.length} Records</span>
          </div>
          <div className="card-body p-0">
            <OfficeList
              offices={offices}
              loading={loading}
              onEdit={(office) => {
                setSelectedOffice(office);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
