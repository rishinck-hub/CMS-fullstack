import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BillingManagement = () => {
  const navigate = useNavigate();
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBillings, setFilteredBillings] = useState([]);

  useEffect(() => {
    loadBillings();
  }, []);

  useEffect(() => {
    // Filter billings based on search term
    const filtered = billings.filter(billing =>
      billing.prescription?.toString().includes(searchTerm) ||
      billing.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billing.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBillings(filtered);
  }, [billings, searchTerm]);

  const loadBillings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/pharmacist/medicinebilling/');
      if (response.ok) {
        const data = await response.json();
        setBillings(data.results || data);
      } else if (response.status === 401) {
        setError('Authentication required. Please log in to view billings.');
      } else if (response.status === 404) {
        // If no billings exist, show empty state
        setBillings([]);
        console.log('No billings found - this is normal for a new system');
      } else {
        throw new Error(`Failed to load billings: ${response.status}`);
      }
    } catch (err) {
      console.error('Error loading billings:', err);
      // Don't show error for 404 - just show empty state
      if (err.message.includes('404')) {
        setBillings([]);
        console.log('No billings API endpoint found - showing empty state');
      } else {
        setError(`Failed to load billings: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading billings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Error Loading Billings</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadBillings}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
            💳 Billing Management
          </h1>
        </div>
      </div>

      {/* Navigation and Search */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by prescription ID or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/working-dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              🏠 Main
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h5 className="text-primary">Total Billings</h5>
              <h3 className="text-primary">{billings.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">Total Revenue</h5>
              <h3 className="text-success">
                {formatCurrency(billings.reduce((sum, b) => sum + parseFloat(b.total_medicine_fee || 0), 0))}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">Today's Billings</h5>
              <h3 className="text-info">
                {billings.filter(b => {
                  const today = new Date().toISOString().split('T')[0];
                  return b.timestamp?.startsWith(today);
                }).length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">Today's Revenue</h5>
              <h3 className="text-warning">
                {formatCurrency(billings.filter(b => {
                  const today = new Date().toISOString().split('T')[0];
                  return b.timestamp?.startsWith(today);
                }).reduce((sum, b) => sum + parseFloat(b.total_medicine_fee || 0), 0))}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Billings Table */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📋 Medicine Billings ({filteredBillings.length} items</h5>
        </div>
        <div className="card-body p-0">
          {filteredBillings.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No billings found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search terms' : 'No billings have been created yet'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Prescription</th>
                    <th>Patient</th>
                    <th>Total Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBillings.map((billing) => (
                    <tr key={billing.id}>
                      <td>{billing.id}</td>
                      <td>
                        <strong>#{billing.prescription}</strong>
                      </td>
                      <td>
                        {billing.patient ? (
                          <div>
                            <strong>{billing.patient.first_name} {billing.patient.last_name}</strong>
                            <br />
                            <small className="text-muted">{billing.patient.phone}</small>
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <strong className="text-success">
                          {formatCurrency(parseFloat(billing.total_medicine_fee || 0))}
                        </strong>
                      </td>
                      <td>
                        <small>{formatDate(billing.timestamp)}</small>
                      </td>
                      <td>
                        <span className="badge bg-success">Completed</span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            title="Print Receipt"
                          >
                            🖨️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">🚀 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <button className="btn btn-outline-primary w-100">
                    💊 Process New Prescription
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-success w-100">
                    📊 Generate Report
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-info w-100">
                    🖨️ Print All Receipts
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-warning w-100">
                    📈 View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
