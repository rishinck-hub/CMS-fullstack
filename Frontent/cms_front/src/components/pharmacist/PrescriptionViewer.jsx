import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrescriptionViewer = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  useEffect(() => {
    // Filter prescriptions based on search term
    const filtered = prescriptions.filter(prescription =>
      prescription.id?.toString().includes(searchTerm) ||
      prescription.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  }, [prescriptions, searchTerm]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      // Use the correct pharmacist endpoint
      const response = await fetch('http://localhost:8000/api/pharmacist/prescriptionmedicines/');
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data.results || data);
      } else if (response.status === 401) {
        setError('Authentication required. Please log in to view prescriptions.');
      } else if (response.status === 404) {
        // If no prescriptions exist, show empty state
        setPrescriptions([]);
        console.log('No prescriptions found - this is normal for a new system');
      } else {
        throw new Error(`Failed to load prescriptions: ${response.status}`);
      }
    } catch (err) {
      console.error('Error loading prescriptions:', err);
      // Don't show error for 404 - just show empty state
      if (err.message.includes('404')) {
        setPrescriptions([]);
        console.log('No prescriptions API endpoint found - showing empty state');
      } else {
        setError(`Failed to load prescriptions: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
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

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleClosePrescription = () => {
    setSelectedPrescription(null);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Error Loading Prescriptions</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadPrescriptions}>
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
            📋 Prescription Viewer
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
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No prescriptions found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search terms' : 'No prescriptions have been created yet'}
              </p>
            </div>
          ) : (
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
                        {prescription.patient ? (
                          <div>
                            <strong>{prescription.patient.first_name} {prescription.patient.last_name}</strong>
                            <br />
                            <small className="text-muted">{prescription.patient.phone}</small>
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {prescription.doctor ? (
                          <div>
                            <strong>Dr. {prescription.doctor.first_name} {prescription.doctor.last_name}</strong>
                            <br />
                            <small className="text-muted">{prescription.doctor.specialization}</small>
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <small>{formatDate(prescription.date_time)}</small>
                      </td>
                      <td>
                        <span className={`badge ${
                          prescription.status === 'Completed' ? 'bg-success' :
                          prescription.status === 'Pending' ? 'bg-warning' : 'bg-secondary'
                        }`}>
                          {prescription.status || 'Unknown'}
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
          )}
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
                    <p><strong>Name:</strong> {selectedPrescription.patient?.first_name} {selectedPrescription.patient?.last_name}</p>
                    <p><strong>Phone:</strong> {selectedPrescription.patient?.phone}</p>
                    <p><strong>DOB:</strong> {selectedPrescription.patient?.dob}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Doctor Information</h6>
                    <p><strong>Name:</strong> Dr. {selectedPrescription.doctor?.first_name} {selectedPrescription.doctor?.last_name}</p>
                    <p><strong>Specialization:</strong> {selectedPrescription.doctor?.specialization}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6>Prescription Details</h6>
                    <p><strong>Date:</strong> {formatDate(selectedPrescription.date_time)}</p>
                    <p><strong>Dosage:</strong> {selectedPrescription.dosage || 'N/A'}</p>
                    <p><strong>Frequency:</strong> {selectedPrescription.frequency || 'N/A'}</p>
                    <p><strong>Duration:</strong> {selectedPrescription.duration || 'N/A'}</p>
                    <p><strong>Notes:</strong> {selectedPrescription.prescription_notes || 'No additional notes'}</p>
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
                    📋 New Prescription
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-success w-100">
                    💊 Process All Pending
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-info w-100">
                    🖨️ Print All
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-warning w-100">
                    📊 View Reports
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

export default PrescriptionViewer;
