"use client";

import { useState, useEffect } from "react";
import { SuchiDartaService } from "@/services/darta-chalani/suchiDartaServices";

export default function SuchiDartaForm({
  onSubmit,
  initialData = null,
  onCancel = null,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      darta_number: "",
      darta_date: "",
      firm_name: "",
      pan_Vat_number: "",
      tax_clearance_FY: "",
      firm_address: "",
      application_date: "",
      contact_person: "",
      firm_registration_address: "",
      firm_darta_number: "",
      contact_number: "",
      firm_working_sector: "",
      email: "",
      suchikrit_dastur_bill_number: "",
      suchikrit_dastur_bill_date: "",
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
      fetchNextSuchiDartaNumber();
      setIsEditMode(false);
    }
  }, [initialData]);

  const fetchNextSuchiDartaNumber = async () => {
    try {
      const response = await SuchiDartaService.nextSuchiDartaNumber();
      setFormData((prev) => ({
        ...prev,
        darta_number: response.data.next_darta_number,
      }));
    } catch (err) {
      console.error("Error fetching next suchi darta number:", err);
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

    try {
      setLoading(true);
      const submitData = {
        darta_date: formData.darta_date.trim() || "",
        firm_name: formData.firm_name.trim() || "",
        pan_Vat_number: formData.pan_Vat_number.trim() || "",
        tax_clearance_FY: formData.tax_clearance_FY.trim() || "",
        firm_address: formData.firm_address.trim() || "",
        application_date: formData.application_date.trim() || "",
        contact_person: formData.contact_person.trim() || "",
        firm_registration_address: formData.firm_registration_address.trim() || "",
        firm_darta_number: formData.firm_darta_number.trim() || "",
        contact_number: formData.contact_number.trim() || "",
        firm_working_sector: formData.firm_working_sector.trim() || "",
        email: formData.email.trim() || "",
        suchikrit_dastur_bill_number: formData.suchikrit_dastur_bill_number.trim() || "",
        suchikrit_dastur_bill_date: formData.suchikrit_dastur_bill_date.trim() || "",
        remarks: formData.remarks.trim() || "",
      };

      // Only include darta_number for new entries (not edits)
      // Backend will auto-generate it, but frontend can show the expected number

      await onSubmit(submitData);
      if (!initialData) {
        setFormData({
          darta_number: "",
          darta_date: "",
          firm_name: "",
          pan_Vat_number: "",
          tax_clearance_FY: "",
          firm_address: "",
          application_date: "",
          contact_person: "",
          firm_registration_address: "",
          firm_darta_number: "",
          contact_number: "",
          firm_working_sector: "",
          email: "",
          suchikrit_dastur_bill_number: "",
          suchikrit_dastur_bill_date: "",
          remarks: "",
        });
        // Fetch next darta number for next entry
        fetchNextSuchiDartaNumber();
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
        <div className="col-md-5 mb-3">
          <label className="form-label">दर्ता मिति <span className="text-danger">*</span></label>
          <input
            name="darta_date"
            className="form-control"
            onChange={handleChange}
            value={formData.darta_date}
            placeholder="e.g,२०८२-१०-०८"
            required
          />
        </div>
        <div className="col-md-5 mb-3">
          <label className="form-label">पान/भ्याट नं. <span className="text-danger">*</span></label>
          <input
            name="pan_Vat_number"
            className="form-control"
            onChange={handleChange}
            value={formData.pan_Vat_number}
            placeholder="e.g, unique"
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="form-label">फर्म/पसल/संस्थाको नाम <span className="text-danger">*</span></label>
          <input
            name="firm_name"
            className="form-control"
            value={formData.firm_name}
            onChange={handleChange}
            placeholder=""
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5 mb-3">
          <label className="form-label">कर चुक्ता आ.व <span className="text-danger">*</span></label>
          <input
            name="tax_clearance_FY"
            className="form-control"
            value={formData.tax_clearance_FY}
            onChange={handleChange}
            placeholder=""
            required
          />
        </div>
        <div className="col-md-7 mb-3">
          <label className="form-label">निवेदन मिति</label>
          <input
            name="application_date"
            className="form-control"
            value={formData.application_date}
            onChange={handleChange}
            placeholder="e.g, २०८२-१०-०८"
            required
          />
        </div>

      </div>
      <div className="row">
        <div className="col-md-12 mb-3">
          <label className="form-label">फर्म/व्यक्तिको ठेगाना <span className="text-danger">*</span></label>
          <input
            name="firm_address"
            type="text"
            className="form-control disable"
            value={formData.firm_address}
            onChange={handleChange}
            required
          />
        </div>


      </div>
      <div className="row">
        <div className="col-md-8 mb-3">
          <label className="form-label">सम्पर्क व्यक्तिको नाम <span className="text-danger">*</span></label>
          <input
            name="contact_person"
            type="text"
            className="form-control disable"
            value={formData.contact_person}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">सम्पर्क नम्बर <span className="text-danger">*</span></label>
          <input
            name="contact_number"
            type="text"
            className="form-control disable"
            value={formData.contact_number}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">संस्था दर्ता नम्बर <span className="text-danger">*</span></label>
          <input
            name="firm_darta_number"
            type="text"
            className="form-control disable"
            value={formData.firm_darta_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-8 mb-3">
          <label className="form-label">संस्था दर्ता भएको ठाउँ <span className="text-danger">*</span></label>
          <input
            name="firm_registration_address"
            type="text"
            className="form-control disable"
            value={formData.firm_registration_address}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="row">

        <div className="col-md-12 mb-3">
          <label className="form-label">कामको विवरण <span className="text-danger">*</span></label>
          <input
            name="firm_working_sector"
            type="text"
            className="form-control disable"
            value={formData.firm_working_sector}
            onChange={handleChange}
            required
          />
        </div>

      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">इमेल </label>
          <input
            name="email"
            type="text"
            className="form-control disable"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">सूचीकृत दस्तुरको रसिद नं. <span className="text-danger">*</span></label>
          <input
            name="suchikrit_dastur_bill_number"
            type="text"
            className="form-control disable"
            value={formData.suchikrit_dastur_bill_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">सूचीकृत दस्तुरको रसिद मिति</label>
          <input
            name="suchikrit_dastur_bill_date"
            type="text"
            className="form-control disable"
            value={formData.suchikrit_dastur_bill_date}
            onChange={handleChange}
            placeholder="e.g, २०८२-१०-०८"
            required
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
