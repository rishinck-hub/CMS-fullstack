import React from "react";
export default function DatePicker({ className = "", ...props }) {
  return (
    <input type="date" className={`form-control ${className}`} {...props} />
  );
}
