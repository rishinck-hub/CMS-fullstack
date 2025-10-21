import React from "react";
export default function Switch({ label, className = "", ...props }) {
  return (
    <div className={`form-check form-switch ${className}`}>
      <input type="checkbox" className="form-check-input" {...props} />
      {label && <label className="form-check-label">{label}</label>}
    </div>
  );
}
