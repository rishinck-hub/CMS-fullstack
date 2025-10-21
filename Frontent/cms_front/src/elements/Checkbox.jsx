import React from "react";
export default function Checkbox({ label, className = "", ...props }) {
  return (
    <div className={`form-check ${className}`}>
      <input type="checkbox" className="form-check-input" {...props} />
      {label && <label className="form-check-label">{label}</label>}
    </div>
  );
}
