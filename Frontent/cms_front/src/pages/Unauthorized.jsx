import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="container py-5 text-center">
      <h2>Unauthorized</h2>
      <p>You don't have permission to view this page.</p>
      <p>
        <Link to="/">Return Home</Link>
      </p>
    </div>
  );
}
