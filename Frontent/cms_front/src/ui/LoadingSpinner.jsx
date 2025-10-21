import React from "react";
export default function LoadingSpinner({ size = "sm", className = "" }) {
  return (
    <div className="text-center">
      <span className={`spinner-border spinner-border-${size} ${className}`} />
    </div>
  );
}
