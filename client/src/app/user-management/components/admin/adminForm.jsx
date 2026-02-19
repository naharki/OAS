"use client";
import { useState, useEffect } from "react";

export default function AdminForm({
  onSubmit,
  initialData = null,
  onCancel = null,
  appsList = []
}) {
  const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      apps: [], // for apps
    },
  );
  
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!initialData);
useEffect(() => {
    if (!initialData) return;

    setFormData({
      username: initialData.username || "",
      email: initialData.email || "",
      password: "",
      confirm_password: "",
      apps: initialData.accessible_apps
        ? initialData.accessible_apps.map((app) => app.id)
        : [],
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
    if (!formData.username.trim()) {
      alert("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      alert("Password is required");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      alert("Password and Confirm Password do not match");
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        username: formData.username.trim() || "",
        email: formData.email.trim() || "",
        password: formData.password.trim() || "",
        confirm_password: formData.password.trim() || "",
        apps: formData.apps, // send selected app IDs
      };

      await onSubmit(submitData);
      if (!initialData) {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirm_password: "",
          apps: [],
        });
      }
       
    } catch (err) {
      console.error("Admin Create Form submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">User Name : </label>
          <input
            name="username"
            type="text"
            className="form-control"
            value={formData.username || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Email : </label>
          <input
            name="email"
            type="email"
            className="form-control"
            onChange={handleChange}
            value={formData.email}
            placeholder="e.g, abc@gmail.com"
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Password : </label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Confirm Password : </label>
          <input
            name="confirm_password"
            type="password"
            className="form-control"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />
        </div>
      </div>
   
      <div className="mb-3">
        <label className="fw-bold">Assign Apps</label>

        {appsList.map((app) => (
          <div className="form-check" key={app.id}>
            <input
              type="checkbox"
              className="form-check-input"
              id={`app-${app.id}`}
              // checked={formData.apps.includes(app.id)}
              checked={Array.isArray(formData.apps) && formData.apps.includes(app.id)}
              onChange={() => handleCheckboxChange(app.id)}
            />
            <label htmlFor={`app-${app.id}`} className="form-check-label">
              {app.name}
            </label>
          </div>
        ))}
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Darta" : "Add Darta"}
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
