import React from "react";
import { Link } from "react-router-dom";
export default function Sidebar({ links = [] }) {
  return (
    <aside className="bg-light border-end p-3" style={{ width: 230, minHeight: "100vh" }}>
      <nav>
        <ul className="nav flex-column">
          {links.map(item => (
            <li className="nav-item" key={item.to}>
              <Link className="nav-link" to={item.to}>
                <i className={`me-2 ${item.icon}`} /> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
