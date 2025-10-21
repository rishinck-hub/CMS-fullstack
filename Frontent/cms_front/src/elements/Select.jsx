import React from "react";
export default function Select({ children, className = "", ...props }) {
  return (
    <select className={`form-select ${className}`} {...props}>
      {children}
    </select>
  );
}
