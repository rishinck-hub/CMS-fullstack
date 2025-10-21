import React from "react";
export default function TextArea({ className = "", ...props }) {
  return (
    <textarea className={`form-control ${className}`} {...props}></textarea>
  );
}
