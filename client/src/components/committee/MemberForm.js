"use client";

import { useState, useEffect } from "react";

export default function MemberForm({
  onSubmit,
  initialData = null,
  onCancel = null,
}) {
  const ROLE_OPTIONS = [
    { value: "adhyaksha", label: "अध्यक्ष" },
    { value: "upadhyaksha", label: "उपाध्यक्ष" },
    { value: "sachiv", label: "सचिव" },
    { value: "kosadhyaksha", label: "कोषाध्यक्ष" },
    { value: "sadasya", label: "सदस्य" },
  ];

  const [formData, setFormData] = useState(
      initialData || {
      designation: "",
      name: "",
      sex: "",
      father_name: "",
      address: "",
      mobile_number: "",
      citizenship_number: "",
      is_account_holder: false,
      is_monitoring_committee_member: false,
    }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Full name is required");
      return;
    }
    try {
      setLoading(true);
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          designation: "",
          name: "",
          sex: "",
          father_name: "",
          address: "",
          mobile_number: "",
          citizenship_number: "",
          is_account_holder: false,
          is_monitoring_committee_member: false,
        });
      }
    } catch (err) {
      console.error("MemberForm submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-8 mb-3">
          <label className="form-label">नाम/थर</label>
          <input
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            required
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">पद</label>
          <select
            name="designation"
            className="form-select"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option>छान्नुहोस्</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="form-label">Sex</label>
          <select
            name="sex"
            className="form-select"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value=''>--Choose Sex--</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="col-md-5 mb-3">
          <label className="form-label">Father Name</label>
          <input
            name="father_name"
            className="form-control"
            value={formData.father_name}
            onChange={handleChange}
            placeholder="Father's name"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Mobile No</label>
          <input
            name="mobile_number"
            className="form-control"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="e.g., 98XXXXXXXX"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <input
          name="address"
          className="form-control"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Citizenship No</label>
          <input
            name="citizenship_number"
            className="form-control"
            value={formData.citizenship_number}
            onChange={handleChange}
            placeholder="Citizenship No"
          />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="accountHolder"
              name="is_account_holder"
              checked={formData.is_account_holder}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="accountHolder">
              Is Account Holder?
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="monitoring"
              name="is_monitoring_committee_member"
              checked={formData.is_monitoring_committee_member}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="monitoring">
              Monitoring Committee?
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Member" : "Add Member"}
      </button>
      {onCancel && (
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
