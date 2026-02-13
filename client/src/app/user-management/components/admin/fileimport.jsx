"use client";

import { FileSpreadsheet, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const FileImport = ({ onSuccess }) => {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async () => {
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select an Excel (.xlsx) file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/darta-chalani/darta/excel-upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(res.data.message || "Excel imported successfully");
      setFile(null);

      setTimeout(() => {
        setShow(false);
        setSuccess("");
      }, 900);

      // Refresh plan list
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Excel upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Import Button */}
      <button
        className="btn btn-sm btn-outline-success me-2 d-flex align-items-center"
        onClick={() => setShow(true)}
      >
        <FileSpreadsheet size={14} className="me-1" /> Import
      </button>

      {/* Modal */}
      {show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
        >
          <div className="bg-white rounded shadow" style={{ width: 420 }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
              <h6 className="mb-0">Import Excel File</h6>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShow(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-3">
              <input
                type="file"
                accept=".xlsx"
                className="form-control mb-2"
                onChange={(e) => setFile(e.target.files[0])}
              />

              {error && <div className="text-danger small">{error}</div>}
              {success && <div className="text-success small">{success}</div>}
            </div>

            {/* Footer */}
            <div className="p-2 border-top d-flex justify-content-end">
              <button
                className="btn btn-sm btn-secondary me-2"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
