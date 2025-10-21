import React from "react";
export default function Button({ children, type = "button", color = "primary", className = "", ...props }) {
  return (
    <button type={type} className={`btn btn-${color} ${className}`} {...props}>
      {children}
    </button>
  );
}
