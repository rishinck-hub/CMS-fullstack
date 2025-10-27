import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "2rem 0 1rem",
      marginTop: "auto"
    }}>
      <div className="container-fluid">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
              🏥 ClinicMS
            </h5>
            <p className="opacity-75" style={{ fontSize: '0.9rem' }}>
              Your comprehensive healthcare management solution.
              Empowering clinics with modern technology and seamless workflows.
            </p>
            <div className="mt-3">
              <span className="me-3">
                <i className="bi bi-geo-alt me-2"></i>
                Healthcare Sector
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Quick Links</h6>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li className="mb-2">
                <Link to="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <a href="/about" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="/support" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Services</h6>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li className="mb-2">
                <span style={{ opacity: 0.9 }}>👨‍⚕️ Doctor Management</span>
              </li>
              <li className="mb-2">
                <span style={{ opacity: 0.9 }}>📋 Patient Management</span>
              </li>
              <li className="mb-2">
                <span style={{ opacity: 0.9 }}>💊 Pharmacy System</span>
              </li>
              <li className="mb-2">
                <span style={{ opacity: 0.9 }}>🧾 Billing & Reports</span>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Connect</h6>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
              <li className="mb-2">
                <span style={{ opacity: 0.9 }}>
                  <i className="bi bi-envelope me-2"></i>
                  support@clinicms.com
                </span>
              </li>
              <li className="mb-2">
                <span style={{ opacity: 0.9 }}>
                  <i className="bi bi-telephone me-2"></i>
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="mb-2">
                <span style={{ opacity: 0.9 }}>
                  <i className="bi bi-clock me-2"></i>
                  Mon-Fri: 9AM-6PM
                </span>
              </li>
              <li className="mt-3">
                <div>
                  <a href="#" className="me-3" style={{ color: 'white', fontSize: '1.5rem' }}>
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="me-3" style={{ color: 'white', fontSize: '1.5rem' }}>
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="me-3" style={{ color: 'white', fontSize: '1.5rem' }}>
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" style={{ color: 'white', fontSize: '1.5rem' }}>
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr style={{ 
          borderTop: '1px solid rgba(255,255,255,0.2)', 
          margin: '1.5rem 0 1rem' 
        }} />
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span style={{ opacity: 0.9, fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} Clinic Management System. All rights reserved.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span style={{ opacity: 0.9, fontSize: '0.875rem' }}>
              Made with ❤️ for Healthcare Professionals
            </span>
          </div>
        </div>
      </div>

      <style>{`
        footer a:hover {
          opacity: 1 !important;
          text-decoration: underline !important;
        }
        footer ul li:hover {
          opacity: 1;
        }
      `}</style>
    </footer>
  );
}
