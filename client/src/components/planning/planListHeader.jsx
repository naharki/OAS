import { FileImport } from "./fileimport";
import { FileExport } from "./FileExport";
import { useState } from "react";
export const PlanListHeader = ({
  data,
  onSuccess,
  ward,
  onApplyWard,
  filterData,
  setnameFilter,
  nameFilter,
  onReset
}) => {
  const [selectedward, setSelectWard] = useState("");

  const handleApply = () => {
    onApplyWard(selectedward);
  };
  const handleReset = () => {
    setSelectWard(""); // reset dropdown
    setnameFilter(""); // reset name filter
    onReset(); // reset parent filters
  };
  return (
    <div className="row mb-3 align-items-center">
      <div className="col-md-2 mb-2">
        <select
          className="form-control"
          value={selectedward}
          onChange={(e) => setSelectWard(e.target.value)}
        >
          <option value="">Select Ward</option>
          {ward.map((w, i) => (
            <option key={i} value={w.number}>
              {w.number}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4 mb-2">
        <input
          placeholder="Filter by योजनाको नाम"
          className="form-control"
          value={nameFilter}
          onChange={(e) => setnameFilter(e.target.value)}
        />
      </div>
      <div className="col-md-5 mb-2 d-flex justify-content-end flex-nowrap">
        <button className="btn btn-sm btn-primary me-2" onClick={handleApply}>
          Apply
        </button>
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={handleReset}
        >
          Reset
        </button>
        <FileImport onSuccess={onSuccess} />
        <FileExport data={filterData.length > 0 ? filterData : data} />
      </div>
      <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-dark fw-bold">📊 Plan List</h5>
        <span className="badge bg-primary mx-4">{filterData.length > 0 ? filterData.length : data.length} Records</span>
      </div>
    </div>
  );
};
