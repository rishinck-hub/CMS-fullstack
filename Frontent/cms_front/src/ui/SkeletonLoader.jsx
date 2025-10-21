import React from "react";
export default function SkeletonLoader({ rows = 3 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div className="placeholder-glow mb-2" key={i}>
          <span className="placeholder col-12" style={{ height: "32px", display: "block" }}></span>
        </div>
      ))}
    </div>
  );
}
