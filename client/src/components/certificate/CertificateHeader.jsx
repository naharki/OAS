import React from 'react';

// Reusable certificate header used in print views.
// Displays Extra (left), Subject (center), Issue Date (right).
export default function CertificateHeader({ field1, field2, field3 }) {
  return (
    <div className="mb-3">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ textAlign: 'left', minWidth: 160 }}><strong>Extra:</strong> {field3}</div>
        <div style={{ textAlign: 'center', flex: 1 }}><strong>{field2}</strong></div>
        <div style={{ textAlign: 'right', minWidth: 160 }}><strong>Issue Date:</strong> {field1}</div>
      </div>
    </div>
  );
}
