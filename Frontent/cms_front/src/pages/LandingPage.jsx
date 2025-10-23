import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return "/login";
    const role = user.role?.toLowerCase();
    return `/${role}/dashboard`;
  };

  const features = [
    {
      icon: "bi-people-fill",
      title: "Patient Management",
      description: "Comprehensive patient records, medical history, and appointment scheduling."
    },
    {
      icon: "bi-heart-pulse-fill",
      title: "Doctor Portal",
      description: "Streamlined consultation management, prescription writing, and patient care."
    },
    {
      icon: "bi-calendar-check-fill",
      title: "Appointment System",
      description: "Smart scheduling, automated reminders, and real-time availability tracking."
    },
    {
      icon: "bi-capsule-fill",
      title: "Pharmacy Management",
      description: "Inventory control, prescription processing, and medication tracking."
    },
    {
      icon: "bi-graph-up-arrow",
      title: "Analytics & Reports",
      description: "Comprehensive insights, performance metrics, and business intelligence."
    },
    {
      icon: "bi-shield-check-fill",
      title: "Secure & Compliant",
      description: "HIPAA compliant, secure data handling, and role-based access control."
    }
  ];

  const stats = [
    { number: "1000+", label: "Patients Served" },
    { number: "50+", label: "Healthcare Providers" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            <i className="bi bi-hospital me-2"></i>
            ClinicMS
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-primary text-white ms-2 px-3" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className={`hero-content ${isVisible ? 'fade-in-up' : ''}`}>
                <h1 className="display-4 fw-bold text-white mb-4">
                  Modern Clinic Management
                  <span className="text-primary"> Made Simple</span>
                </h1>
                <p className="lead text-white-50 mb-4">
                  Streamline your healthcare practice with our comprehensive clinic management system. 
                  Manage patients, appointments, prescriptions, and more with ease.
                </p>
                <div className="hero-buttons">
                  <Link to="/login" className="btn btn-primary btn-lg me-3">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Get Started
                  </Link>
                  <a href="#features" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-play-circle me-2"></i>
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={`hero-image ${isVisible ? 'fade-in-right' : ''}`}>
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <div className="preview-title">ClinicMS Dashboard</div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-stats">
                      <div className="stat-card">
                        <i className="bi bi-people"></i>
                        <div>
                          <div className="stat-number">1,247</div>
                          <div className="stat-label">Patients</div>
                        </div>
                      </div>
                      <div className="stat-card">
                        <i className="bi bi-calendar-check"></i>
                        <div>
                          <div className="stat-number">89</div>
                          <div className="stat-label">Today's Appointments</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-6 mb-4">
                <div className="stat-item">
                  <h3 className="display-6 fw-bold">{stat.number}</h3>
                  <p className="mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Comprehensive Healthcare Management</h2>
              <p className="lead text-muted">
                Everything you need to run a modern healthcare practice efficiently and effectively.
              </p>
            </div>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="feature-card h-100">
                  <div className="feature-icon">
                    <i className={`bi ${feature.icon}`}></i>
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">Why Choose ClinicMS?</h2>
              <div className="about-features">
                <div className="about-feature mb-4">
                  <div className="d-flex">
                    <div className="about-icon me-3">
                      <i className="bi bi-check-circle-fill text-success"></i>
                    </div>
                    <div>
                      <h5>User-Friendly Interface</h5>
                      <p className="text-muted">Intuitive design that requires minimal training for your staff.</p>
                    </div>
                  </div>
                </div>
                <div className="about-feature mb-4">
                  <div className="d-flex">
                    <div className="about-icon me-3">
                      <i className="bi bi-check-circle-fill text-success"></i>
                    </div>
                    <div>
                      <h5>Scalable Solution</h5>
                      <p className="text-muted">Grows with your practice from small clinics to large hospitals.</p>
                    </div>
                  </div>
                </div>
                <div className="about-feature mb-4">
                  <div className="d-flex">
                    <div className="about-icon me-3">
                      <i className="bi bi-check-circle-fill text-success"></i>
                    </div>
                    <div>
                      <h5>24/7 Support</h5>
                      <p className="text-muted">Round-the-clock technical support and assistance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-image">
                <div className="image-placeholder">
                  <i className="bi bi-hospital display-1 text-primary"></i>
                  <p className="mt-3 text-muted">Modern Healthcare Technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">Ready to Transform Your Practice?</h2>
              <p className="lead mb-4">
                Join thousands of healthcare providers who trust ClinicMS for their practice management needs.
              </p>
              <Link to="/login" className="btn btn-light btn-lg">
                <i className="bi bi-rocket-takeoff me-2"></i>
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer-section py-5 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-hospital me-2"></i>
                ClinicMS
              </h5>
              <p className="text-muted">
                Modern clinic management system designed to streamline healthcare operations 
                and improve patient care.
              </p>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3">Product</h6>
              <ul className="list-unstyled">
                <li><a href="#features" className="text-muted text-decoration-none">Features</a></li>
                <li><a href="#about" className="text-muted text-decoration-none">About</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Pricing</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Demo</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3">Support</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-muted text-decoration-none">Help Center</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Documentation</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Contact Us</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Status</a></li>
              </ul>
            </div>
            <div className="col-lg-4 mb-4">
              <h6 className="fw-bold mb-3">Contact Info</h6>
              <div className="contact-info">
                <p className="text-muted mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  support@clinicms.com
                </p>
                <p className="text-muted mb-2">
                  <i className="bi bi-telephone me-2"></i>
                  +1 (555) 123-4567
                </p>
                <p className="text-muted">
                  <i className="bi bi-geo-alt me-2"></i>
                  123 Healthcare St, Medical City, MC 12345
                </p>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-muted mb-0">
                © 2024 ClinicMS. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="social-links">
                <a href="#" className="text-muted me-3">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-muted me-3">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-muted me-3">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="text-muted">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: -1;
        }

        .hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        .fade-in-right {
          animation: fadeInRight 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .dashboard-preview {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
          transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
          transition: transform 0.3s ease;
        }

        .dashboard-preview:hover {
          transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
        }

        .preview-header {
          background: #f8f9fa;
          padding: 15px 20px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          align-items: center;
        }

        .preview-dots {
          display: flex;
          gap: 8px;
          margin-right: 15px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.red { background: #ff5f57; }
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #28ca42; }

        .preview-title {
          font-weight: 600;
          color: #333;
        }

        .preview-content {
          padding: 20px;
        }

        .preview-stats {
          display: flex;
          gap: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          flex: 1;
        }

        .stat-card i {
          font-size: 24px;
          color: #667eea;
        }

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        .feature-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .feature-icon i {
          font-size: 32px;
          color: white;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }

        .feature-description {
          color: #666;
          line-height: 1.6;
        }

        .about-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .about-icon i {
          font-size: 20px;
        }

        .image-placeholder {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          padding: 60px 40px;
          text-align: center;
          border: 2px dashed #dee2e6;
        }

        .navbar {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95) !important;
        }

        .btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .hero-buttons .btn {
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .hero-section {
            text-align: center;
          }
          
          .dashboard-preview {
            transform: none;
            margin-top: 30px;
          }
          
          .preview-stats {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
