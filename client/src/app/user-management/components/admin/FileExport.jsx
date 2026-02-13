import { FileSpreadsheet } from "lucide-react";

export const FileExport = ({ data }) => {
  const exportPlans = () => {
    if (!data || data.length === 0) {
      alert('No plans to export');
      return;
    }

    // Correct headers
    const headers = [
      'दर्ता नं', 
      'आयोजनाको नाम', 
      'वडा नं', 
      'स्थान', 
      'विनियोजित बजेट', 
      'कार्यान्वयन तह', 
      'योजना अवस्था', 
      'मिति'
    ];

    // Map rows using actual field names
    const rows = data.map(p => [
      p.registration_number,
      p.plan_name,
      p.ward_number,
      p.location,
      p.allocated_budget,
      p.implementation_level,
      p.implementation_status,
      p.date
    ]);

    const csvContent = [headers, ...rows]
      .map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plans.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      className="btn btn-sm btn-outline-success me-2 d-flex align-items-center" 
      onClick={exportPlans}  
      title="Export to Excel"
    >
      <FileSpreadsheet size={14} className="me-1" /> Export
    </button>
  );
};
