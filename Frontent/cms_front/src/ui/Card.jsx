import React from "react";
export default function Card({ children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      <div className="card-body">{children}</div>
    </div>
  );
}
