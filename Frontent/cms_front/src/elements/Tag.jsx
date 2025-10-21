import React from "react";
export default function Tag({ children, color = "secondary", className = "" }) {
  return (
    <span className={`badge rounded-pill bg-${color} ${className}`}>{children}</span>
  );
}
