import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ClinicMS</Link>
      </div>
    </nav>
  );
}
