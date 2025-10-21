import React, { useState } from "react";
export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <ul className="nav nav-tabs mb-2">
        {tabs.map((tab, i) => (
          <li className="nav-item" key={tab.label}>
            <button
              className={`nav-link ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div>
        {tabs[active] && tabs[active].content}
      </div>
    </>
  );
}
