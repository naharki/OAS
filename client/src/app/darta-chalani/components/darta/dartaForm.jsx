"use client";

import { useState, useEffect } from "react";
import { DartaService } from "@/services/darta-chalani/dartaChalaniServices";

export default function DartaForm({
  onSubmit,
  initialData = null,
  onCancel = null,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      darta_number: "",
      darta_samuha: "",
      darta_date: "",
      letter_date: "",
      ref_number: "",
      letter_sender: "",
      sender_email: "",
      sender_address: "",
      letter_catagory: "",
      subject: "",
      receiver_section: "",
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
      // Fetch next darta number for new entry
      fetchNextDartaNumber();
      setIsEditMode(false);
    }
  }, [initialData]);

  const fetchNextDartaNumber = async () => {
    try {
      const response = await DartaService.nextDartaNumber();
      setFormData((prev) => ({
        ...prev,
        darta_number: response.data.next_darta_number,
      }));
    } catch (err) {
      console.error("Error fetching next darta number:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.darta_date.trim()) {
      alert("Darta Date is required");
      return;
    }
    if (!formData.letter_sender.trim()) {
      alert("Letter Sender is required");
      return;
    }
    if (!formData.subject.trim()) {
      alert("Subject is required");
      return;
    }
    if (!formData.receiver_section.trim()) {
      alert("Receiver Section is required");
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        letter_sender: formData.letter_sender.trim() || "",
        darta_date: formData.darta_date.trim() || "",
        ref_number: formData.ref_number.trim() || "",
        letter_date: formData.letter_date.trim() || "",
        letter_catagory: formData.letter_catagory.trim() || "",
        subject: formData.subject.trim() || "",
        receiver_section: formData.receiver_section.trim() || "",
        remarks: formData.remarks.trim() || "",
        darta_samuha: formData.darta_samuha.trim() || "",
      };

      // Only include darta_number for new entries (not edits)
      // Backend will auto-generate it, but frontend can show the expected number

      await onSubmit(submitData);
      if (!initialData) {
        setFormData({
          darta_number: "",
          darta_samuha: "",
          darta_date: "",
          letter_catagory: "",
          ref_number: "",
          letter_date: "",
          letter_sender: "",
          sender_email: "",
          sender_address: "",
          subject: "",
          receiver_section: "",
          remarks: "",
        });
        // Fetch next darta number for next entry
        fetchNextDartaNumber();
      }
    } catch (err) {
      console.error("Darta Form submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-2 mb-3">
          <label className="form-label">दर्ता नम्बर</label>
          <input
            name="darta_number"
            className="form-control"
            value={formData.darta_number || ""}
            readOnly
            disabled
          />
        </div>
        <div className="col-md-2 mb-3">
          <label className="form-label">दर्ता समुह</label>
          <input
            name="darta_samuha"
            className="form-control"
            onChange={handleChange}
            value={formData.darta_samuha}
            placeholder="e.g, मुख्य समुह"
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5 mb-3">
          <label className="form-label">दर्ता मिति </label>
          <input
            name="darta_date"
            className="form-control"
            value={formData.darta_date}
            onChange={handleChange}
            placeholder="e.g, 2023-10-10"
            required
          />
        </div>

        <div className="col-md-2 mb-3">
          <label className="form-label">चलानी नं</label>
          <input
            name="ref_number"
            type="number"
            className="form-control"
            value={formData.ref_number}
            onChange={handleChange}
            placeholder="Ref Number"
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
        <div className="col-md-10 mb-3">
          <label className="form-label">पठाउने</label>
          <input
            name="letter_sender"
            type="text"
            className="form-control disable"
            value={formData.letter_sender}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
          <label className="form-label">पाउने फाँट</label>
          <input
            name="receiver_section"
            type="text"
            className="form-control disable"
            value={formData.receiver_section}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">कैफियत</label>
          <input
            name="remarks"
            type="text"
            className="form-control disable"
            value={formData.remarks || ''}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">पठाउनेको ईमेल</label>
          <input
            name="sender_email"
            type="text"
            className="form-control disable"
            value={formData.sender_email}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">पठाउनेको ठेगाना</label>
          <input
            name="sender_address"
            type="text"
            className="form-control disable"
            value={formData.sender_address}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <label className="form-label">प्रकार</label>
          <input
            name="letter_catagory"
            className="form-control"
            onChange={handleChange}
            value={formData.letter_catagory}
            placeholder=""
            disabled
          />
        </div>
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
