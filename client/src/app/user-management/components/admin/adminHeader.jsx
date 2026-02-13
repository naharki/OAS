import { FileImport } from "./fileimport";
import { FileExport } from "./FileExport";
import { useState } from "react";

export const AdminListHeader = ({
  data,
  onSuccess,
  filterData,
  setUsernameFilter,
  usernameFilter,
  setEmailFilter,
  emailFilter,
  onReset
}) => {

  const handleApply = () => {
    // No specific apply logic here since filters are managed in parent
  }
  const handleReset = () => {
    setUsernameFilter("");
    setEmailFilter(""); 
    onReset();
  };
  return (
    <div className="row mb-3 align-items-center">
      <div className="col-md-3 mb-2">
        <input
          placeholder="Filter by username"
          className="form-control"
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
        />
      </div>
      <div className="col-md-3 mb-2">
        <input
          placeholder="Filter by email"
          className="form-control"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-2 d-flex justify-content-end flex-nowrap">
        <button className="btn btn-sm btn-primary me-2" onClick={handleApply}>
          Apply
        </button>
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={handleReset}
        >
          Reset
        </button>
        <FileImport onSuccess={onSuccess}/>
        <FileExport data={filterData.length > 0 ? filterData : data} disabled/>
      </div>
      <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-dark fw-bold">📊List</h5>
        <span className="badge bg-primary mx-4">{filterData.length > 0 ? filterData.length : data.length} Records</span>
      </div>
    </div>
  );
};
