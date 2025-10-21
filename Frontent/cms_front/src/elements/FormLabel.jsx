import React from "react";
export default function FormLabel({ children, htmlFor }) {
  return <label htmlFor={htmlFor} className="form-label">{children}</label>;
}
