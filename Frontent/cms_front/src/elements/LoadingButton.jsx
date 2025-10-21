import React from "react";
export default function LoadingButton({ isLoading, children, ...props }) {
  return (
    <button {...props} disabled={props.disabled || isLoading}>
      {isLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
      {children}
    </button>
  );
}
