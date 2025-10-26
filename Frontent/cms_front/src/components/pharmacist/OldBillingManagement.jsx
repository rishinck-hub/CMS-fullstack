import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OldBillingManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Simple static data - old style
  const billings = [
    {
      id: 1,
      prescription: 101,
      patient: 'John Doe',
      phone: '9876543210',
      total_amount: 250.50,
      date: '2024-01-15',
      status: 'Paid'
    },
    {
      id: 2,
      prescription: 102,
      patient: 'Jane Smith',
      phone: '9876543211',
      total_amount: 180.75,
      date: '2024-01-14',
      status: 'Paid'
    },
    {
      id: 3,
      prescription: 103,
      patient: 'Mike Johnson',
      phone: '9876543212',
      total_amount: 320.00,
      date: '2024-01-15',
      status: 'Pending'
    },
    {
      id: 4,
      prescription: 104,
      patient: 'Sarah Williams',
      phone: '9876543213',
      total_amount: 150.25,
      date: '2024-01-13',
      status: 'Paid'
    }
  ];

  const filteredBillings = billings.filter(billing =>
    billing.prescription.toString().includes(searchTerm) ||
    billing.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
            💳 Billing Management - OLD STYLE
          </h1>
        </div>
      </div>

      {/* Navigation */}
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

      {/* Summary Cards - Old Style */}
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
                {formatCurrency(billings.reduce((sum, b) => sum + b.total_amount, 0))}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">Paid Billings</h5>
              <h3 className="text-info">
                {billings.filter(b => b.status === 'Paid').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">Pending</h5>
              <h3 className="text-warning">
                {billings.filter(b => b.status === 'Pending').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Billings Table - Old Style */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📋 Medicine Billings ({filteredBillings.length} items)</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Prescription</th>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Amount</th>
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
                      <strong>{billing.patient}</strong>
                    </td>
                    <td>{billing.phone}</td>
                    <td>
                      <strong className="text-success">
                        {formatCurrency(billing.total_amount)}
                      </strong>
                    </td>
                    <td>{billing.date}</td>
                    <td>
                      <span className={`badge ${
                        billing.status === 'Paid' ? 'bg-success' : 'bg-warning'
                      }`}>
                        {billing.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary" title="View Details">
                          👁️
                        </button>
                        <button className="btn btn-sm btn-outline-info" title="Print Receipt">
                          🖨️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success text-center">
            <h4>🎉 Old Style Billing Management Working!</h4>
            <p>Simple, clean billing management with static data.</p>
            <p><strong>Features:</strong> View billings, search, track revenue, and more!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldBillingManagement;


