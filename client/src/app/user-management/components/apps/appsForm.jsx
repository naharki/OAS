"use client";
import { useState, useEffect } from "react";

export default function AppsForm({
  onSubmit,
  initialData = null,
  onCancel = null,
}) {
  const [formData, setFormData] = useState({
      name: ""
    },
  );
  
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!initialData);
useEffect(() => {
    if (!initialData) return;

    setFormData({
      name: initialData.name || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

// Handle checkbox selection for apps
  const handleCheckboxChange = (appId) => {
    setFormData((prev) => {
      if (prev.apps.includes(appId)) {
        return { ...prev, apps: prev.apps.filter((id) => id !== appId) };
      } else {
        return { ...prev, apps: [...prev.apps, appId] };
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Apps Name is required");
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        name: formData.name.trim() || "",

      };

      await onSubmit(submitData);
      if (!initialData) {
        setFormData({
          name: "",
        });
      }
       
    } catch (err) {
      console.error("Apps Create Form submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Apps Name : </label>
          <input
            name="name"
            type="text"
            className="form-control"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
      
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Apps" : "Add Apps"}
      </button>
      {onCancel && (
        <button
          type="button"
          className="btn btn-danger ms-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
