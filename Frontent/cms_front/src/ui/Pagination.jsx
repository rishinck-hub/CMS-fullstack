import React from "react";
export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <nav>
      <ul className="pagination justify-content-center">
        {Array.from({ length: pages }).map((_, i) => (
          <li className={`page-item ${i + 1 === page ? "active" : ""}`} key={i}>
            <button className="page-link" onClick={() => onPage(i + 1)}>{i + 1}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
