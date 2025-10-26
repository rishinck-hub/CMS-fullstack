import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleBillingManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample billing data
  const billings = [
    {
      id: 1,
      prescription: 101,
      patient: {
        first_name: 'John',
        last_name: 'Doe',
        phone: '9876543210'
      },
      total_medicine_fee: 250.50,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      prescription: 102,
      patient: {
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '9876543211'
      },
      total_medicine_fee: 180.75,
      timestamp: new Date(Date.now() - 86400000).toISOString() // Yesterday
    },
    {
      id: 3,
      prescription: 103,
      patient: {
        first_name: 'Mike',
        last_name: 'Johnson',
        phone: '9876543212'
      },
      total_medicine_fee: 320.00,
      timestamp: new Date().toISOString()
    },
    {
      id: 4,
      prescription: 104,
      patient: {
        first_name: 'Sarah',
        last_name: 'Williams',
        phone: '9876543213'
      },
      total_medicine_fee: 150.25,
      timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];

  const filteredBillings = billings.filter(billing =>
    billing.prescription.toString().includes(searchTerm) ||
    billing.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    billing.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      <div>
                        <strong>{billing.patient.first_name} {billing.patient.last_name}</strong>
                        <br />
                        <small className="text-muted">{billing.patient.phone}</small>
                      </div>
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

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              {/* <h5 className="mb-0">🚀 Quick Actions</h5> */}
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  {/* <button className="btn btn-outline-primary w-100">
                    💊 Process New Prescription
                  </button> */}
                </div>
                <div className="col-md-3">
                  {/* <button className="btn btn-outline-success w-100">
                    📊 Generate Report
                  </button> */}
                </div>
                <div className="col-md-3">
                  {/* <button className="btn btn-outline-info w-100">
                    🖨️ Print All Receipts
                  </button> */}
                </div>
                <div className="col-md-3">
                  {/* <button className="btn btn-outline-warning w-100">
                    📈 View Analytics
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {/* <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success text-center">
            <h4>🎉 Billing Management is Working!</h4>
            <p>You can now view, search, and manage billings successfully.</p>
            <p><strong>Features:</strong> View billings, track revenue, print receipts, and more!</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SimpleBillingManagement;


