import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const BillingManagement = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    totalBillings: 0,
    todayBillings: 0,
    totalRevenue: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    loadBillings();
    loadStats();
  }, []);

  const loadBillings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pharmacist/medicinebilling/');
      setBillings(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error loading billings:', err);
      setError('Failed to load billings');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/pharmacist/medicinebilling/dashboard_stats/');
      setStats(response.data.stats || stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const openDetailsModal = (billing) => {
    setSelectedBilling(billing);
    setShowDetailsModal(true);
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusBadge = (billing) => {
    // For now, all billings are considered completed
    return <span className="badge bg-success">Completed</span>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading billing records...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '20px' }}>
        <div className="card-body" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', color: 'white' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2">
                <i className="fas fa-receipt me-3"></i>
                Billing Management
              </h2>
              <p className="mb-0 opacity-75">Manage medicine billing and payments</p>
            </div>
            <button 
              className="btn btn-light btn-lg"
              onClick={loadBillings}
            >
              <i className="fas fa-sync me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4 g-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">📋</div>
              <h4 className="text-primary">Total Billings</h4>
              <h2 className="text-primary">{stats.totalBillings}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">📅</div>
              <h4 className="text-info">Today's Billings</h4>
              <h2 className="text-info">{stats.todayBillings}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">💰</div>
              <h4 className="text-success">Total Revenue</h4>
              <h2 className="text-success">{formatCurrency(stats.totalRevenue)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">📊</div>
              <h4 className="text-warning">Today's Revenue</h4>
              <h2 className="text-warning">{formatCurrency(stats.todayRevenue)}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {/* Billings Table */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
        <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
          <h5 className="mb-0">🧾 Billing Records ({billings.length})</h5>
        </div>
        <div className="card-body">
          {billings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Billing ID</th>
                    <th>Prescription ID</th>
                    <th>Patient</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billings.map((billing) => (
                    <tr key={billing.id}>
                      <td>
                        <strong>#{billing.id}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">#{billing.prescription}</span>
                      </td>
                      <td>
                        <strong>{billing.patient?.first_name || '—'} {billing.patient?.last_name || ''}</strong>
                      </td>
                      <td>
                        <strong className="text-success">{formatCurrency(billing.total_medicine_fee)}</strong>
                      </td>
                      <td>
                        <small>{new Date(billing.timestamp).toLocaleDateString()}</small>
                        <br />
                        <small className="text-muted">{new Date(billing.timestamp).toLocaleTimeString()}</small>
                      </td>
                      <td>
                        {getStatusBadge(billing)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openDetailsModal(billing)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-receipt fa-3x mb-3"></i>
              <p>No billing records found.</p>
              <small>Billing records will appear here when prescriptions are processed.</small>
            </div>
          )}
        </div>
      </div>

      {/* Billing Details Modal */}
      {showDetailsModal && selectedBilling && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-receipt me-2"></i>
                  Billing Details - #{selectedBilling.id}
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Billing Info */}
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      Billing Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Billing ID:</strong> #{selectedBilling.id}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Prescription ID:</strong> #{selectedBilling.prescription}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Patient:</strong> {selectedBilling.patient?.first_name || '—'} {selectedBilling.patient?.last_name || ''}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Total Amount:</strong> <span className="text-success">{formatCurrency(selectedBilling.total_medicine_fee)}</span></p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Created By:</strong> {selectedBilling.created_by?.first_name || '—'} {selectedBilling.created_by?.last_name || ''}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Date:</strong> {new Date(selectedBilling.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescription Details */}
                <div className="card">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-prescription me-2"></i>
                      Prescription Details
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      This billing was created for prescription #{selectedBilling.prescription}. 
                      The total amount includes all prescribed medicines and their quantities.
                    </div>
                    <div className="text-center">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => {
                          // Could navigate to prescription details if needed
                          alert('Prescription details would be shown here');
                        }}
                      >
                        <i className="fas fa-eye me-2"></i>
                        View Prescription Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    // Could add print functionality here
                    alert('Print functionality would be implemented here');
                  }}
                >
                  <i className="fas fa-print me-2"></i>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagement;
