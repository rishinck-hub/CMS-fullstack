import React from "react";
export default function TimePicker({ className = "", ...props }) {
  return (
    <input type="time" className={`form-control ${className}`} {...props} />
  );
}
