import React from "react";
export default function Dropdown({ label, items = [], onSelect, className = "" }) {
  return (
    <div className={`dropdown ${className}`}>
      <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
        {label}
      </button>
      <ul className="dropdown-menu">
        {items.map((item, i) => (
          <li key={i}>
            <button className="dropdown-item" onClick={() => onSelect(item)}>{item}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
