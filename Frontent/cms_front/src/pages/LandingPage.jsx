import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import bgImage from "../assets/images/landingpage.jpg"; // adjust path if needed

export default function LandingPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const adminTarget = isAuthenticated
    ? user?.role === "Admin"
      ? "/admin/dashboard"
      : "/unauthorized"
    : "/login";

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {/* Overlay for readability */}
      <div style={{
        background: "rgba(255, 255, 255, 0.23)",
        minHeight: "100vh",
        width: "100vw"
      }}>
        <header className="py-5 text-center bg-light" style={{background: "transparent"}}>
          <div className="container">
            <h1 className="display-5">Welcome to Clinic Management System</h1>
            <p className="lead">
              Manage patients, doctors, appointments and pharmacy from one place.
            </p>
            <p>
              <Link to="/login" className="btn btn-primary btn-lg me-2">
                Login
              </Link>
              {/* <Link to={adminTarget} className="btn btn-outline-secondary btn-lg">
                Admin Dashboard
              </Link> */}
            </p>
          </div>
        </header>
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h3>Features</h3>
                <ul>
                  <li>Patient & staff management</li>
                  <li>Doctor scheduling</li>
                  <li>Pharmacy and prescriptions</li>
                  <li>Reports and analytics</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h3>Get started</h3>
                <p>
                  Use the login button to sign in or explore the demo admin panel.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
