import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  // Determine role-based dashboard link
  let dashboardLink = "/login"; // default
  if (isAuthenticated && user?.role === "Admin") {
    dashboardLink = "/admin/dashboard";
  } else if (isAuthenticated && user?.role === "Receptionist") {
    dashboardLink = "/receptionist/dashboard";
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          ClinicMS
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={dashboardLink}>
                    {user.role} Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    style={{ textDecoration: "none" }}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
