import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestBillingPrescription = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('billing');
  const [billings, setBillings] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // Create sample billing data
    const sampleBillings = [
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
      }
    ];

    // Create sample prescription data
    const samplePrescriptions = [
      {
        id: 101,
        patient: {
          first_name: 'John',
          last_name: 'Doe',
          phone: '9876543210',
          dob: '1990-01-15'
        },
        doctor: {
          first_name: 'Dr. Sarah',
          last_name: 'Wilson',
          specialization: 'General Medicine'
        },
        date_time: new Date().toISOString(),
        status: 'Completed',
        dosage: '2 tablets',
        frequency: 'Twice daily',
        duration: '7 days',
        prescription_notes: 'Take with food'
      },
      {
        id: 102,
        patient: {
          first_name: 'Jane',
          last_name: 'Smith',
          phone: '9876543211',
          dob: '1985-05-20'
        },
        doctor: {
          first_name: 'Dr. Michael',
          last_name: 'Brown',
          specialization: 'Cardiology'
        },
        date_time: new Date(Date.now() - 86400000).toISOString(),
        status: 'Pending',
        dosage: '1 tablet',
        frequency: 'Once daily',
        duration: '14 days',
        prescription_notes: 'Monitor blood pressure'
      },
      {
        id: 103,
        patient: {
          first_name: 'Mike',
          last_name: 'Johnson',
          phone: '9876543212',
          dob: '1992-08-10'
        },
        doctor: {
          first_name: 'Dr. Emily',
          last_name: 'Davis',
          specialization: 'Pediatrics'
        },
        date_time: new Date().toISOString(),
        status: 'Completed',
        dosage: '1 teaspoon',
        frequency: 'Three times daily',
        duration: '5 days',
        prescription_notes: 'Shake well before use'
      }
    ];

    setBillings(sampleBillings);
    setPrescriptions(samplePrescriptions);
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

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
            🏥 Pharmacy Management System
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex gap-2 justify-content-center">
            <button
              className={`btn ${activeTab === 'billing' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('billing')}
            >
              💳 Billing Management
            </button>
            <button
              className={`btn ${activeTab === 'prescriptions' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('prescriptions')}
            >
              📋 Prescription Viewer
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/working-dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/')}
            >
              🏠 Main
            </button>
          </div>
        </div>
      </div>

      {/* Billing Management Tab */}
      {activeTab === 'billing' && (
        <div>
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="text-center text-primary">💳 Billing Management</h2>
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
              <h5 className="mb-0">📋 Medicine Billings ({billings.length} items)</h5>
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
                    {billings.map((billing) => (
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
        </div>
      )}

      {/* Prescription Viewer Tab */}
      {activeTab === 'prescriptions' && (
        <div>
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="text-center text-primary">📋 Prescription Viewer</h2>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card text-center border-primary">
                <div className="card-body">
                  <h5 className="text-primary">Total Prescriptions</h5>
                  <h3 className="text-primary">{prescriptions.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-success">
                <div className="card-body">
                  <h5 className="text-success">Today's Prescriptions</h5>
                  <h3 className="text-success">
                    {prescriptions.filter(p => {
                      const today = new Date().toISOString().split('T')[0];
                      return p.date_time?.startsWith(today);
                    }).length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-info">
                <div className="card-body">
                  <h5 className="text-info">Pending</h5>
                  <h3 className="text-info">
                    {prescriptions.filter(p => p.status === 'Pending').length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-warning">
                <div className="card-body">
                  <h5 className="text-warning">Completed</h5>
                  <h3 className="text-warning">
                    {prescriptions.filter(p => p.status === 'Completed').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Prescriptions Table */}
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">📋 Prescriptions ({prescriptions.length} items)</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-primary">
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription) => (
                      <tr key={prescription.id}>
                        <td>{prescription.id}</td>
                        <td>
                          <div>
                            <strong>{prescription.patient.first_name} {prescription.patient.last_name}</strong>
                            <br />
                            <small className="text-muted">{prescription.patient.phone}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>Dr. {prescription.doctor.first_name} {prescription.doctor.last_name}</strong>
                            <br />
                            <small className="text-muted">{prescription.doctor.specialization}</small>
                          </div>
                        </td>
                        <td>
                          <small>{formatDate(prescription.date_time)}</small>
                        </td>
                        <td>
                          <span className={`badge ${
                            prescription.status === 'Completed' ? 'bg-success' :
                            prescription.status === 'Pending' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {prescription.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" title="View Prescription">
                              👁️
                            </button>
                            <button className="btn btn-sm btn-outline-success" title="Process Prescription">
                              💊
                            </button>
                            <button className="btn btn-sm btn-outline-info" title="Print Prescription">
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
        </div>
      )}

      {/* Success Message */}
      {/* <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success text-center">
            <h4>🎉 Billing & Prescription Management Working!</h4>
            <p>Both billing management and prescription viewer are now functional with sample data.</p>
            <p><strong>Features:</strong> View billings, manage prescriptions, track revenue, and more!</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TestBillingPrescription;


