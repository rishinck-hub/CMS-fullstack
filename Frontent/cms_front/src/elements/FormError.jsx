import React from "react";
export default function FormError({ message }) {
  return message ? <div className="text-danger small">{message}</div> : null;
}
