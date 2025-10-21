import React from "react";
export default function Toast({ message, show, type = "info", onClose }) {
  if (!show) return null;
  return (
    <div className={`toast align-items-center text-bg-${type} show`} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1051 }} role="alert">
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button type="button" className="btn-close ms-2 m-auto" onClick={onClose}></button>
      </div>
    </div>
  );
}
