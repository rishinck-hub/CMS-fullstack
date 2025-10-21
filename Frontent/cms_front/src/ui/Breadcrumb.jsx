import React from "react";
export default function Breadcrumb({ items = [] }) {
  return (
    <nav>
      <ol className="breadcrumb">
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`breadcrumb-item ${idx === items.length - 1 ? "active" : ""}`}
            aria-current={idx === items.length - 1 ? "page" : undefined}
          >
            {item}
          </li>
        ))}
      </ol>
    </nav>
  );
}
