import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';

const PrescriptionHistory = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getPrescriptions();
      setPrescriptions(response.data || []);
    } catch (err) {
      console.error('Error loading prescriptions:', err);
      setError('Failed to load prescription history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading prescription history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="fas fa-exclamation-circle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '20px' }}>
        <div className="card-body" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', color: 'white' }}>
          <h2 className="mb-2">
            <i className="fas fa-prescription me-3"></i>
            Prescription History
          </h2>
          <p className="mb-0 opacity-75">View all your prescribed medications and their details</p>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">📋</div>
              <h4 className="text-primary">Total Prescriptions</h4>
              <h2 className="text-primary">{prescriptions.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body text-center">
              <div className="display-6 mb-2">💊</div>
              <h4 className="text-info">Total Medicines</h4>
              <h2 className="text-info">
                {prescriptions.reduce((sum, p) => sum + (p.medicines?.length || 0), 0)}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
        <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
          <h5 className="mb-0">📋 All Prescriptions</h5>
        </div>
        <div className="card-body">
          {prescriptions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Medicines</th>
                    <th>Diagnosis</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td>{new Date(prescription.date_time).toLocaleDateString()}</td>
                      <td>
                        <strong>{prescription.consultation_details?.patient_name || '—'}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {prescription.medicines?.length || 0} {prescription.medicines?.length === 1 ? 'medicine' : 'medicines'}
                        </span>
                      </td>
                      <td>{prescription.consultation_details?.diagnosis || '—'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          <i className="fas fa-eye me-1"></i>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-prescription fa-3x mb-3"></i>
              <p>No prescriptions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-prescription me-2"></i>
                  Prescription Details
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedPrescription(null)}
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
                        <p className="mb-1"><strong>Prescription ID:</strong> #{selectedPrescription.id}</p>
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
                  onClick={() => setSelectedPrescription(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionHistory;

