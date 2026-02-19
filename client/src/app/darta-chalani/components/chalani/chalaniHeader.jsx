import { FileImport } from "./fileimport";
import { FileExport } from "./FileExport";
import { useState } from "react";

export const ChalaniListHeader = ({
  data,
  onSuccess,
  filterData,
  setChalaniNumberFilter,
  chalaniNumberFilter,
  setReceiverFilter,
  receiverFilter,
  setSubjectFilter,
  subjectFilter,
  onReset
}) => {

  const handleApply = () => {
    // No specific apply logic here since filters are managed in parent
  }
  const handleReset = () => {
    setChalaniNumberFilter(""); // reset chalani number filter
    setReceiverFilter(""); // reset receiver filter
    setSubjectFilter(""); // reset subject filter
    onReset(); // reset parent filters
  };
  return (
    <div className="row mb-3 align-items-center">
     
      <div className="col-md-1 mb-2">
        <input
          placeholder="Filter by मिति देखि"
          className="form-control"
          value={chalaniNumberFilter}
          onChange={(e) => setChalaniNumberFilter(e.target.value)}
        />
      </div>
      <div className="col-md-1 mb-2">
        <input
          placeholder="Filter by मिति सम्म"
          className="form-control"
          value={receiverFilter}
          onChange={(e) => setReceiverFilter(e.target.value)}
        />
      </div>
      <div className="col-md-1 mb-2">
        <input
          placeholder="Filter by चलानी नं"
          className="form-control"
          value={chalaniNumberFilter}
          onChange={(e) => setChalaniNumberFilter(e.target.value)}
        />
      </div>
      <div className="col-md-3 mb-2">
        <input
          placeholder="Filter by पत्र पठाउने कार्यालय"
          className="form-control"
          value={receiverFilter}
          onChange={(e) => setReceiverFilter(e.target.value)}
        />
      </div>
      <div className="col-md-3 mb-2">
        <input
          placeholder="Filter by बिषय"
          className="form-control"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        />
      </div>
      <div className="col-md-3 mb-2 d-flex justify-content-end flex-nowrap">
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
        <FileExport data={filterData.length > 0 ? filterData : data} disabled/>
      </div>
      <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-dark fw-bold">📊 Chalani List</h5>
        <span className="badge bg-primary mx-4">{filterData.length > 0 ? filterData.length : data.length} Records</span>
      </div>
    </div>
  );
};
