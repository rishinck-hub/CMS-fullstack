import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OldPrescriptionViewer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Simple static data - old style
  const prescriptions = [
    {
      id: 101,
      patient: 'John Doe',
      phone: '9876543210',
      doctor: 'Dr. Sarah Wilson',
      specialization: 'General Medicine',
      date: '2024-01-15',
      status: 'Completed',
      medicine: 'Paracetamol 500mg',
      dosage: '2 tablets twice daily'
    },
    {
      id: 102,
      patient: 'Jane Smith',
      phone: '9876543211',
      doctor: 'Dr. Michael Brown',
      specialization: 'Cardiology',
      date: '2024-01-14',
      status: 'Pending',
      medicine: 'Amlodipine 5mg',
      dosage: '1 tablet once daily'
    },
    {
      id: 103,
      patient: 'Mike Johnson',
      phone: '9876543212',
      doctor: 'Dr. Emily Davis',
      specialization: 'Pediatrics',
      date: '2024-01-15',
      status: 'Completed',
      medicine: 'Amoxicillin 250mg',
      dosage: '1 capsule three times daily'
    },
    {
      id: 104,
      patient: 'Sarah Williams',
      phone: '9876543213',
      doctor: 'Dr. Robert Taylor',
      specialization: 'Dermatology',
      date: '2024-01-13',
      status: 'Pending',
      medicine: 'Clotrimazole Cream',
      dosage: 'Apply twice daily'
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.id.toString().includes(searchTerm) ||
    prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
            📋 Prescription Viewer - OLD STYLE
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
              placeholder="Search by prescription ID, patient name, or doctor..."
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
              <h5 className="text-primary">Total Prescriptions</h5>
              <h3 className="text-primary">{prescriptions.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">Completed</h5>
              <h3 className="text-success">
                {prescriptions.filter(p => p.status === 'Completed').length}
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
              <h5 className="text-warning">Today's</h5>
              <h3 className="text-warning">
                {prescriptions.filter(p => p.date === '2024-01-15').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions Table - Old Style */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📋 Prescriptions ({filteredPrescriptions.length} items)</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Doctor</th>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id}>
                    <td>{prescription.id}</td>
                    <td>
                      <strong>{prescription.patient}</strong>
                    </td>
                    <td>{prescription.phone}</td>
                    <td>
                      <div>
                        <strong>{prescription.doctor}</strong>
                        <br />
                        <small className="text-muted">{prescription.specialization}</small>
                      </div>
                    </td>
                    <td>{prescription.medicine}</td>
                    <td>{prescription.dosage}</td>
                    <td>{prescription.date}</td>
                    <td>
                      <span className={`badge ${
                        prescription.status === 'Completed' ? 'bg-success' : 'bg-warning'
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

      {/* Success Message */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success text-center">
            <h4>🎉 Old Style Prescription Viewer Working!</h4>
            <p>Simple, clean prescription viewer with static data.</p>
            <p><strong>Features:</strong> View prescriptions, search, track status, and more!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldPrescriptionViewer;


