'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CertificateHeader from './CertificateHeader';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CertificateEditor({ committeeId, initialData }) {
  const defaultTemplate =
    'This is to certify that {{subject}} was inspected on {{issue_date}}. ' +
    'The certificate pertains to {{extra}}. Please keep this document for future reference.';
  const [issueDate, setIssueDate] = useState(initialData?.issue_date || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [extra, setExtra] = useState(initialData?.extra || '');
  const [content, setContent] = useState(
    initialData?.content ||
      defaultTemplate
        .replace(/{{\s*issue_date\s*}}/g, initialData?.issue_date || '')
        .replace(/{{\s*subject\s*}}/g, initialData?.subject || '')
        .replace(/{{\s*extra\s*}}/g, initialData?.extra || '')
  );

  // --------------------
  // UI state
  // --------------------
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(initialData?.saved_at || null);
  const textareaRef = useRef(null);

  // --------------------
  // Keep tokens updated
  // --------------------
  useEffect(() => {
    setContent((prev) => {
      let next = prev || defaultTemplate;
      next = next.replace(/{{\s*issue_date\s*}}/g, issueDate);
      next = next.replace(/{{\s*subject\s*}}/g, subject);
      next = next.replace(/{{\s*extra\s*}}/g, extra);
      return next;
    });
  }, [issueDate, subject, extra]);

  // --------------------
  // Save to real API
  // --------------------
  const handleSave = async () => {
    if (!issueDate) {
      alert('Issue Date is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        issue_date: issueDate,
        subject,
        extra,
        content,
      };

      const url = `${API_URL}/committees/${committeeId}/certificate/`;

      if (initialData) {
        // Update existing certificate
        await axios.put(url, payload);
      } else {
        // Create new certificate
        await axios.post(url, payload);
      }

      setSavedAt(new Date().toISOString());
      alert('Certificate saved successfully');
    } catch (error) {
      console.error('Certificate save failed:', error);
      alert('Failed to save certificate');
    } finally {
      setSaving(false);
    }
  };

  // --------------------
  // Reset editor
  // --------------------
  const handleCancel = () => {
    setContent(
      defaultTemplate
        .replace(/{{\s*issue_date\s*}}/g, issueDate)
        .replace(/{{\s*subject\s*}}/g, subject)
        .replace(/{{\s*extra\s*}}/g, extra)
    );
  };
  return (
    <div className="mb-4">
      <div className="card shadow-sm p-3 mb-3 d-print-none">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="small text-muted">Extra</label>
            <input
              className="form-control form-control-sm fw-semibold"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="small text-muted">Subject</label>
            <input
              className="form-control form-control-sm fw-semibold"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="small text-muted">Issue Date</label>
            <input
              className="form-control form-control-sm fw-semibold"
              placeholder="DD/MM/YYYY"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex justify-content-end mb-2 d-print-none">
        <button
          className="btn btn-sm btn-success me-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
          Reset Text
        </button>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="form-control rounded p-3 mb-2 d-print-none"
        style={{ minHeight: 160, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
      />

      {/* Print view */}
      <div className="d-none d-print-block">
        <CertificateHeader
          field1={issueDate}
          field2={subject}
          field3={extra}
        />
        <div style={{ textAlign: 'justify', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {content}
        </div>
      </div>

      {savedAt && (
        <div className="text-muted small mt-2">
          Last saved: {new Date(savedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}