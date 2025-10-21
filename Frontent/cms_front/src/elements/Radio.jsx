import React from "react";
export default function Radio({ label, className = "", ...props }) {
  return (
    <div className={`form-check ${className}`}>
      <input type="radio" className="form-check-input" {...props} />
      {label && <label className="form-check-label">{label}</label>}
    </div>
  );
}
