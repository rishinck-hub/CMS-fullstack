import React from "react";
export default function FormGroup({ children, className = "" }) {
  return (
    <div className={`mb-3 ${className}`}>{children}</div>
  );
}
