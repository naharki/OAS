"use client";

import { useState, useEffect } from "react";

export default function OfficeForm({ office, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    email: "",
    website: "",
    office_logo: "",
    nishan_chap: "",
    location: "",
    slogan: "",
    established_date: "",
  });

  useEffect(() => {
    if (office) {
      setFormData(office);
    }
  }, [office]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      website: "",
      slogan: "",
      nishan_chap: "",
      office_logo: "",
      full_name: "",
      location: "",
      slogan: "",
      established_date: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-bold text-dark">Office Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., HQ Office"
            value={formData.name || ""}
            onChange={handleChange}
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "6px" }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold text-dark">
            Full Office Name
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="e.g., Headquarters Office"
            value={formData.full_name || ""}
            onChange={handleChange}
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "6px" }}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Location</label>
            <input
              name="location"
              type="text"
              placeholder="e.g., 123 Business Street, City, Country"
              value={formData.location || ""}
              onChange={handleChange}
              required
              className="form-control"
              rows="3"
              style={{ borderRadius: "6px" }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Contact</label>
            <input
              type="tel"
              name="phone_number"
              placeholder="9878828273"
              value={formData.phone_number || ""}
              onChange={handleChange}
              required
              className="form-control"
              rows="1"
              style={{ borderRadius: "6px" }}
            />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Website</label>
            <input
              type="url"
              name="website"
              placeholder="https://abc.gov.np/"
              value={formData.website || ""}
              onChange={handleChange}
              required
              className="form-control"
              rows="1"
              style={{ borderRadius: "6px" }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Gmail</label>
            <input
              name="email"
              type="email"
              placeholder="abc@gmail.com"
              value={formData.email || ""}
              onChange={handleChange}
              required
              className="form-control"
              rows="1"
              style={{ borderRadius: "6px" }}
            />
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-bold text-dark">Slogan</label>
          <input
            type="text"
            name="slogan"
            placeholder="e.g., Innovating Tomorrow"
            value={formData.slogan || ""}
            onChange={handleChange}
            className="form-control form-control-lg"
            style={{ borderRadius: "6px" }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold text-dark">
            Established Date
          </label>
          <input
            type="date"
            name="established"
            value={formData.established_date || ""}
            onChange={handleChange}
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "6px" }}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
           <label className="form-label fw-bold text-dark">
            Nishan Chap
          </label>
          <input
            type="file"
            name="nishan_chap"
            onChange={handleChange}
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "6px" }}
          />
        </div>
        <div className="col-md-6">
             <label className="form-label fw-bold text-dark">
            Office_logo
          </label>
          <input
            type="file"
            name="office_logo"
            onChange={handleChange}
            required
            className="form-control form-control-lg"
            style={{ borderRadius: "6px" }}
          />
        </div>
      </div>

      <div className="d-flex gap-2 pt-3 border-top">
        <button
          type="submit"
          className="btn btn-success btn-lg"
          style={{ borderRadius: "6px" }}
        >
          ✓ Save Office
        </button>
        <button
          type="reset"
          className="btn btn-outline-secondary btn-lg"
          style={{ borderRadius: "6px" }}
        >
          ↻ Reset
        </button>
      </div>
    </form>
  );
}
