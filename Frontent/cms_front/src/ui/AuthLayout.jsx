import React from "react";
export default function AuthLayout({ children }) {
  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <div style={{ maxWidth: 400, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
