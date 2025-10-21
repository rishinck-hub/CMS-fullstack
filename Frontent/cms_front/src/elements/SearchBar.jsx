import React from "react";
export default function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <input
      type="search"
      className={`form-control ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
