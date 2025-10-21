import React from "react";
export default function Label({ children, htmlFor }) {
  return <label htmlFor={htmlFor} className="form-label">{children}</label>;
}
