// import { FileImport } from "./fileimport";
// import { FileExport } from "./FileExport";
import { useState } from "react";

export const AppsHeader = ({
  data,
  onSuccess,
  filterData,
  appsnameFilter,
  setAppsnameFilter,
  onReset
}) => {

  const handleApply = () => {
 
  }
  const handleReset = () => {
    setAppsnameFilter("");
    onReset();
  };
  return (
    <div className="row mb-3 align-items-center">
      <div className="col-md-3 mb-2">
        <input
          placeholder="Filter by Apps name"
          className="form-control"
          value={appsnameFilter}
          onChange={(e) => setAppsnameFilter(e.target.value)}
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
        {/* <FileImport onSuccess={onSuccess}/> */}
        {/* <FileExport data={filterData.length > 0 ? filterData : data} disabled/> */}
      </div>
      <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-dark fw-bold">📊 List</h5>
        <span className="badge bg-primary mx-4">{filterData.length > 0 ? filterData.length : data.length} Records</span>
      </div>
    </div>
  );
};
