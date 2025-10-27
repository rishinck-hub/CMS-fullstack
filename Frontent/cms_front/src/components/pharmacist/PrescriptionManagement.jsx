import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pharmacist/prescriptions/pending/');
      setPrescriptions(response.data || []);
    } catch (err) {
      console.error('Error loading prescriptions:', err);
      setError('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBilling = async (prescription) => {
    try {
      await api.post('/pharmacist/medicinebilling/create_billing/', {
        prescription_id: prescription.id
      });
      alert('Billing created successfully!');
      loadPrescriptions(); // Refresh to remove from pending list
    } catch (err) {
      console.error('Error creating billing:', err);
      alert('Failed to create billing: ' + (err.response?.data?.detail || err.message));
    }
  };

  const openDetailsModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const calculateTotal = (medicines) => {
    if (!medicines || !Array.isArray(medicines)) return 0;
    return medicines.reduce((total, med) => {
      // Note: We'll need to get medicine prices from the medicine table
      // For now, using a placeholder calculation
      return total + (med.quantity * 10); // Placeholder price
    }, 0);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading prescriptions...</p>
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
                <i className="fas fa-prescription me-3"></i>
                Prescription Management
              </h2>
              <p className="mb-0 opacity-75">View and fulfill prescriptions</p>
            </div>
            <button 
              className="btn btn-light btn-lg"
              onClick={loadPrescriptions}
            >
              <i className="fas fa-sync me-2"></i>
              Refresh
            </button>
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

      {/* Prescriptions Table */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
        <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
          <h5 className="mb-0">📋 Pending Prescriptions ({prescriptions.length})</h5>
        </div>
        <div className="card-body">
          {prescriptions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Prescription ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                    <th>Medicines</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td>
                        <strong>#{prescription.id}</strong>
                      </td>
                      <td>
                        <strong>{prescription.consultation_details?.patient_name || '—'}</strong>
                      </td>
                      <td>
                        <small>Dr. {prescription.doctor?.first_name || '—'}</small>
                      </td>
                      <td>
                        <small className="text-muted">{prescription.consultation_details?.diagnosis || '—'}</small>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {prescription.medicines?.length || 0} items
                        </span>
                      </td>
                      <td>
                        <small>{new Date(prescription.date_time).toLocaleDateString()}</small>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openDetailsModal(prescription)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleCreateBilling(prescription)}
                          >
                            <i className="fas fa-receipt me-1"></i>
                            Bill
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-prescription fa-3x mb-3"></i>
              <p>No pending prescriptions found.</p>
              <small>Prescriptions will appear here when doctors create them.</small>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-prescription me-2"></i>
                  Prescription Details - #{selectedPrescription.id}
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Patient Info */}
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-user me-2"></i>
                      Patient Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Name:</strong> {selectedPrescription.consultation_details?.patient_name || '—'}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Appointment ID:</strong> {selectedPrescription.consultation_details?.appointment_id || '—'}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Prescription Date:</strong> {new Date(selectedPrescription.date_time).toLocaleString()}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Doctor:</strong> Dr. {selectedPrescription.doctor?.first_name || '—'}</p>
                      </div>
                    </div>
                    {selectedPrescription.consultation_details?.diagnosis && (
                      <div className="mt-2">
                        <p className="mb-1"><strong>Diagnosis:</strong></p>
                        <p className="text-muted">{selectedPrescription.consultation_details.diagnosis}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prescribed Medicines */}
                <div className="card">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-pills me-2"></i>
                      Prescribed Medicines ({selectedPrescription.medicines?.length || 0})
                    </h6>
                  </div>
                  <div className="card-body">
                    {selectedPrescription.medicines && selectedPrescription.medicines.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead className="table-light">
                            <tr>
                              <th>Medicine Name</th>
                              <th>Quantity</th>
                              <th>Dosage</th>
                              <th>Frequency</th>
                              <th>Duration</th>
                              {selectedPrescription.medicines.some(m => m.notes) && <th>Notes</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPrescription.medicines.map((medicine, idx) => (
                              <tr key={idx}>
                                <td><strong>{medicine.medicine_name}</strong></td>
                                <td>{medicine.quantity}</td>
                                <td>{medicine.dosage}</td>
                                <td>{medicine.frequency}</td>
                                <td>{medicine.duration}</td>
                                {selectedPrescription.medicines.some(m => m.notes) && (
                                  <td>{medicine.notes || '—'}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No medicines prescribed</p>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedPrescription.prescription_notes && (
                  <div className="card mt-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-sticky-note me-2"></i>
                        Additional Notes
                      </h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{selectedPrescription.prescription_notes}</p>
                    </div>
                  </div>
                )}
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
                    setShowDetailsModal(false);
                    handleCreateBilling(selectedPrescription);
                  }}
                >
                  <i className="fas fa-receipt me-2"></i>
                  Create Billing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;
