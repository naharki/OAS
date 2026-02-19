// import { FileImport } from "./darta/fileimport";
// import { FileExport } from "./darta/FileExport";
import { useState } from "react";

export const SuchiDartaListHeader = ({
  data,
  onSuccess,
  filterData,
  setDartaNumberFilter,
  dartaNumberFilter,
  firmNameFilter,
  setFirmNameFilter,
  setVatNumberFilter,
  vatNumberFilter,
  setContactNumberFilter,
  contactNumberFilter,
  onReset
}) => {

  const handleApply = () => {
    // No specific apply logic here since filters are managed in parent
  }
  const handleReset = () => {
    setDartaNumberFilter(""); // reset darta number filter
    setFirmNameFilter(""); // reset firm name filter
    setVatNumberFilter(""); // reset vat number filter
    setContactNumberFilter(""); // reset contact number filter
    onReset(); // reset parent filters
  };
  return (
    <div className="row mb-3 align-items-center">
      <div className="col-md-2 mb-2">
        <input
          placeholder="Filter by Darta No"
          className="form-control"
          value={dartaNumberFilter}
          onChange={(e) => setDartaNumberFilter(e.target.value)}
        />
      </div>
      <div className="col-md-3 mb-2">
        <input
          placeholder="Filter by Firm Name"
          className="form-control"
          value={firmNameFilter}
          onChange={(e) => setFirmNameFilter(e.target.value)}
        />
      </div>
      <div className="col-md-2 mb-2">
        <input
          placeholder="Filter by PAN/VAT No"
          className="form-control"
          value={vatNumberFilter}
          onChange={(e) => setVatNumberFilter(e.target.value)}
        />
      </div>
      <div className="col-md-2 mb-2">
        <input
          placeholder="Filter by Contact No"
          className="form-control"
          value={contactNumberFilter}
          onChange={(e) => setContactNumberFilter(e.target.value)}
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
        {/* <FileImport onSuccess={onSuccess} /> */}
        {/* <FileExport data={filterData.length > 0 ? filterData : data} disabled/> */}
      </div>
      <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-dark fw-bold">📊 Plan List</h5>
        <span className="badge bg-primary mx-4">{filterData.length > 0 ? filterData.length : data.length} Records</span>
      </div>
    </div>
  );
};
