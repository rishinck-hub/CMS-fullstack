import React from "react";
export default function ButtonGroup({ children, className = "" }) {
  return (
    <div className={`btn-group ${className}`} role="group">
      {children}
    </div>
  );
}
