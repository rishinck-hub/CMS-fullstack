import React from "react";
export default function IconButton({ icon: IconComponent, children, color = "primary", className = "", ...props }) {
  return (
    <button type="button" className={`btn btn-${color} d-flex align-items-center ${className}`} {...props}>
      {IconComponent && <IconComponent style={{ marginRight: children ? 6 : 0 }} />}
      {children}
    </button>
  );
}
