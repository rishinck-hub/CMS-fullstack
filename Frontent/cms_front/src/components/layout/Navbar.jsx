import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return "/login";
    const role = user.role?.toLowerCase();
    return `/${role}/dashboard`;
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-primary-gradient">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-hospital me-2"></i>
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
            <ul className="navbar-nav ms-auto align-items-center">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to={getDashboardPath()}>
                      <i className="bi bi-speedometer2 me-1"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a 
                      className="nav-link dropdown-toggle" 
                      href="#" 
                      role="button" 
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {user?.username}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <span className="dropdown-item-text">
                          <small className="text-muted">Role: {user?.role}</small>
                        </span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item" 
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-1"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <style>{`
        .navbar-primary-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        .navbar-primary-gradient .navbar-brand,
        .navbar-primary-gradient .nav-link,
        .navbar-primary-gradient .dropdown-toggle {
          color: #fff !important;
        }
        .navbar-primary-gradient .nav-link:hover,
        .navbar-primary-gradient .navbar-brand:hover {
          color: #ffe38b !important;
          transition: color 0.3s;
        }
      `}</style>
    </>
  );
}
