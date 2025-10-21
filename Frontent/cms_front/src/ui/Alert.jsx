import React from "react";
export default function Alert({ message, type = "info", className = "" }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} ${className}`} role="alert">
      {message}
    </div>
  );
}
