"use client";

import { useState, useEffect } from "react";
import { ChalaniService } from "@/services/darta-chalani/dartaChalaniServices";

export default function ChalaniForm({
  onSubmit,
  initialData = null,
  onCancel = null,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      chalani_number: "",
      chalani_samuha: "",
      chalani_date: "",
      letter_date: "",
      letter_receiver: "",
      subject: "",
      sender_section: "",
      remarks: "",
    },
  );
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!initialData);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      setIsEditMode(true);
    } else {
      // Fetch next chalani number for new entry
      fetchNextChalaniNumber();
      setIsEditMode(false);
    }
  }, [initialData]);

  const fetchNextChalaniNumber = async () => {
    try {
      const response = await ChalaniService.nextChalaniNumber();
      setFormData((prev) => ({
        ...prev,
        chalani_number: response.data.next_chalani_number,
      }));
    } catch (err) {
      console.error("Error fetching next chalani number:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.letter_receiver.trim()) {
      alert("Letter Receiver is required");
      return;
    }
    if (!formData.subject.trim()) {
      alert("Subject is required");
      return;
    }
    if (!formData.sender_section.trim()) {
      alert("Sender Section is required");
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        letter_receiver: formData.letter_receiver.trim() || "",
        chalani_date: formData.chalani_date.trim() || "",
        letter_date: formData.letter_date.trim() || "",
        subject: formData.subject.trim() || "",
        sender_section: formData.sender_section.trim() || "",
        remarks: formData.remarks.trim() || "",
        chalani_samuha: formData.chalani_samuha.trim() || "",
      };

      // Only include chalani_number for new entries (not edits)
      // Backend will auto-generate it, but frontend can show the expected number

      await onSubmit(submitData);
      if (!initialData) {
        setFormData({
          chalani_number: "",
          chalani_samuha: "",
          chalani_date: "",
          letter_date: "",
          letter_receiver: "",
          subject: "",
          sender_section: "",
          remarks: "",
        });
        // Fetch next chalani number for next entry
        fetchNextChalaniNumber();
      }
    } catch (err) {
      console.error("Chalani Form submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-2 mb-3">
          <label className="form-label">चलानी नं</label>
          <input
            name="chalani_number"
            className="form-control"
            value={formData.chalani_number || ""}
            readOnly
            disabled
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">चलानी समुह</label>
          <input
            name="chalani_samuha"
            className="form-control"
            onChange={handleChange}
            value={formData.chalani_samuha}
            placeholder="e.g., मुख्य"
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="form-label">पत्र पाउने कार्यालय/व्यक्ति</label>
        <input
          name="letter_receiver"
          type="text"
          className="form-control disable"
          value={formData.letter_receiver}
          onChange={handleChange}
          required
        />
      </div>
      <div className="row">
        <div className="col-md-5 mb-3">
          <label className="form-label">चलानी मिति </label>
          <input
            name="chalani_date"
            className="form-control"
            value={formData.chalani_date}
            onChange={handleChange}
            placeholder="e.g, 2023-10-10"
            required
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">पत्रको मिति</label>
          <input
            name="letter_date"
            className="form-control"
            value={formData.letter_date}
            onChange={handleChange}
            placeholder="e.g, 2023-10-10"
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-9 mb-3">
          <label className="form-label">बिषय</label>
          <input
            name="subject"
            type="text"
            className="form-control disable"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">कैफियत</label>
          <input
            name="remarks"
            type="text"
            className="form-control disable"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>
      </div>
       <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">पत्र पठाउने फाँट</label>
        </div>
        <div className="col-md-9">
          <input
            name="sender_section"
            type="text"
            className="form-control disable"
            value={formData.sender_section}
            onChange={handleChange}
          />
        </div>
      </div>
     

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Chalani" : "Add Chalani"}
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
