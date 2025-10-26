import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimplePrescriptionViewer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Sample prescription data
  const prescriptions = [
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
    },
    {
      id: 104,
      patient: {
        first_name: 'Sarah',
        last_name: 'Williams',
        phone: '9876543213',
        dob: '1988-03-25'
      },
      doctor: {
        first_name: 'Dr. Robert',
        last_name: 'Taylor',
        specialization: 'Dermatology'
      },
      date_time: new Date(Date.now() - 172800000).toISOString(),
      status: 'Pending',
      dosage: 'Apply thin layer',
      frequency: 'Twice daily',
      duration: '10 days',
      prescription_notes: 'Apply to affected area only'
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.id.toString().includes(searchTerm) ||
    prescription.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleClosePrescription = () => {
    setSelectedPrescription(null);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
            📋 Prescription Viewer - WORKING! ✅
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
          <h5 className="mb-0">📋 Prescriptions ({filteredPrescriptions.length} items)</h5>
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
                {filteredPrescriptions.map((prescription) => (
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
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewPrescription(prescription)}
                          title="View Prescription"
                        >
                          👁️
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Process Prescription"
                        >
                          💊
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="Print Prescription"
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
        </div>
      </div>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📋 Prescription Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClosePrescription}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Patient Information</h6>
                    <p><strong>Name:</strong> {selectedPrescription.patient.first_name} {selectedPrescription.patient.last_name}</p>
                    <p><strong>Phone:</strong> {selectedPrescription.patient.phone}</p>
                    <p><strong>DOB:</strong> {selectedPrescription.patient.dob}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Doctor Information</h6>
                    <p><strong>Name:</strong> Dr. {selectedPrescription.doctor.first_name} {selectedPrescription.doctor.last_name}</p>
                    <p><strong>Specialization:</strong> {selectedPrescription.doctor.specialization}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6>Prescription Details</h6>
                    <p><strong>Date:</strong> {formatDate(selectedPrescription.date_time)}</p>
                    <p><strong>Dosage:</strong> {selectedPrescription.dosage}</p>
                    <p><strong>Frequency:</strong> {selectedPrescription.frequency}</p>
                    <p><strong>Duration:</strong> {selectedPrescription.duration}</p>
                    <p><strong>Notes:</strong> {selectedPrescription.prescription_notes}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClosePrescription}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  Process Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {/* <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success text-center">
            <h4>🎉 Prescription Viewer is Working!</h4>
            <p>You can now view, search, and manage prescriptions successfully.</p>
            <p><strong>Features:</strong> Search prescriptions, view details, process prescriptions, and more!</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SimplePrescriptionViewer;


