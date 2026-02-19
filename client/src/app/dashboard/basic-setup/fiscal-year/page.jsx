"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle } from 'lucide-react';
import FiscalYearList from "@/components/fiscal-year/FiscalYearList";
import FiscalYearForm from "@/components/fiscal-year/FiscalYearForm";
import { fiscalyearsService } from "@/services/fiscalYearServices";

export default function FiscalYearPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // checking daa

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const resp = await fiscalyearsService.list();
      setItems(resp.data.data || resp.data);
    } catch (err) {
      console.error("Error fetching Fiscal Years:", err);
      setError("Failed to load Fiscal Years");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setEditing(null);
      }
    };
    if (showForm) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showForm]);

  const handleSave = async (data) => {
    try {
      setError("");
      if (editing) {
        await axios.put(API_URL + `/fiscalyears/${editing.id}/`, data);
        setSuccess("fiscal year updated successfully");
      } else {
        await axios.post(API_URL + "/fiscalyears/", data);
        setSuccess("fiscal year created successfully");
      }
      await fetchItems();
      setShowForm(false);
      setEditing(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving fiscal year:", err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const messages = Object.entries(errorData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val[0] : val}`)
            .join(", ");
          setError(messages);
        } else {
          setError(errorData);
        }
      } else {
        setError("Failed to save fiscal year");
      }
    }
  };

  const handleEdit = (it) => {
    setEditing(it);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this fiscal year?")) return;
    try {
      await axios.delete(API_URL + `/fiscalyears/${id}/`);
      setSuccess("fiscal year deleted successfully");
      await fetchItems();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting fiscal year:", err);
      setError("Failed to delete fiscal year");
    }
  };

  return (
    <div className="p-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light border-bottom">
          <h5 className="mb-0">🏘️ fiscal year Management</h5>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success:</strong> {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess("")}
              ></button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">📋 fiscal year List</h6>
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              <PlusCircle size={18} className="me-2" /> Add fiscal year
            </button>
          </div>

          {/* Popup form with backdrop */}
          {showForm && (
            <div>
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ background: 'rgba(0,0,0,0.35)', zIndex: 2990 }}
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                aria-hidden
              />

              <div
                style={{ zIndex: 3000 }}
                className="position-fixed top-50 start-50 translate-middle"
              >
                <div className="card shadow" style={{ minWidth: 420 }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">{editing ? '✏️ Edit fiscal year' : '➕ Add New fiscal year'}</h6>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          setShowForm(false);
                          setEditing(null);
                        }}
                      />
                    </div>
                    <FiscalYearForm
                      onSubmit={async (data) => {
                        await handleSave(data);
                      }}
                      initialData={editing}
                      onCancel={() => {
                        setShowForm(false);
                        setEditing(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <hr />

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="alert alert-info">No fiscalyears found. Create one to get started!</div>
          ) : (
            <FiscalYearList items={items} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}
