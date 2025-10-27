import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    medicine_name: '',
    quantity: 1,
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await fetchConsultations();
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    try {
      const response = await api.get('/doctor/consultations/');
      setConsultations(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Failed to load consultations');
      setConsultations([]);
    }
  };

  const handleStartPrescription = (consultation) => {
    setSelectedConsultation(consultation);
    setShowPrescriptionModal(true);
    setPrescriptionMedicines([]);
  };

  const handleAddMedicineToPrescription = () => {
    if (!newMedicine.medicine_name || !newMedicine.dosage || !newMedicine.frequency || !newMedicine.duration) {
      alert('Please fill all required medicine fields');
      return;
    }
    
    setPrescriptionMedicines([...prescriptionMedicines, {
      ...newMedicine,
      id: Date.now() // Generate unique ID for local management
    }]);
    
    setNewMedicine({
      medicine_name: '',
      quantity: 1,
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    });
  };

  const handleRemoveMedicine = (index) => {
    setPrescriptionMedicines(prescriptionMedicines.filter((_, i) => i !== index));
  };

  const handleSubmitPrescription = async () => {
    if (prescriptionMedicines.length === 0) {
      alert('Please add at least one medicine to the prescription');
      return;
    }

    try {
      // Get doctor id from the user
      const doctorProfile = await api.get('/admin/me/');
      const doctorId = doctorProfile.data.profile?.id;
      
      if (!doctorId) {
        alert('Doctor profile not found');
        return;
      }

      // Create prescription
      const prescriptionResponse = await api.post('/doctor/prescriptions/', {
        consultation: selectedConsultation.id,
        doctor: doctorId,
        prescription_notes: ''
      });

      // Add each medicine to the prescription
      for (const medicine of prescriptionMedicines) {
        await api.post(`/doctor/prescriptions/${prescriptionResponse.data.id}/add_medicine/`, {
          medicine_name: medicine.medicine_name,
          quantity: medicine.quantity,
          dosage: medicine.dosage,
          frequency: medicine.frequency,
          duration: medicine.duration,
          notes: medicine.notes
        });
      }

      alert('Prescription created successfully!');
      setShowPrescriptionModal(false);
      setPrescriptionMedicines([]);
      fetchConsultations();
    } catch (err) {
      alert('Failed to create prescription: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
              <h5 className="mb-0">
                <i className="fas fa-stethoscope me-2"></i>
                Patient Consultations
              </h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading consultations...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-danger">
                  <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={loadData}>
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="row">
                  <div className="col-md-6">
                    <div className="list-group">
                      {consultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className={`list-group-item list-group-item-action ${
                            selectedConsultation?.id === consultation.id ? 'active' : ''
                          }`}
                          onClick={() => setSelectedConsultation(consultation)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{consultation.patient_name}</h6>
                            <small>
                              <span className="badge bg-primary">
                                Consultation #{consultation.id}
                              </span>
                            </small>
                          </div>
                          <p className="mb-1">
                            <strong>Diagnosis:</strong> {consultation.diagnosis || 'Not specified'}
                          </p>
                          <small>
                            {new Date(consultation.date_time).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                    {consultations.length === 0 && (
                      <div className="text-center py-4 text-muted">
                        <i className="fas fa-stethoscope fa-2x mb-3"></i>
                        <p>No consultations found</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    {selectedConsultation ? (
                      <div>
                        <div className="card mb-4">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Consultation Details</h6>
                          </div>
                          <div className="card-body">
                            <p><strong>Patient:</strong> {selectedConsultation.patient_name}</p>
                            <p><strong>Symptoms:</strong> {selectedConsultation.symptoms || 'Not specified'}</p>
                            <p><strong>Diagnosis:</strong> {selectedConsultation.diagnosis || 'Not specified'}</p>
                            <p><strong>Notes:</strong> {selectedConsultation.notes || 'No notes'}</p>
                            <p><strong>Date:</strong> {new Date(selectedConsultation.date_time).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="d-grid">
                          <button
                            className="btn btn-success btn-lg"
                            onClick={() => handleStartPrescription(selectedConsultation)}
                          >
                            <i className="fas fa-prescription-bottle-alt me-2"></i>
                            Create Prescription
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted py-5">
                        <i className="fas fa-user-md fa-3x mb-3"></i>
                        <p>Select a consultation to view details and prescribe medication</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedConsultation && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Create Prescription for {selectedConsultation.patient_name}</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowPrescriptionModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="card mb-3">
                  <div className="card-body">
                    <h6>Medicines in Prescription</h6>
                    {prescriptionMedicines.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Medicine</th>
                              <th>Quantity</th>
                              <th>Dosage</th>
                              <th>Frequency</th>
                              <th>Duration</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescriptionMedicines.map((med, idx) => (
                              <tr key={idx}>
                                <td>{med.medicine_name}</td>
                                <td>{med.quantity}</td>
                                <td>{med.dosage}</td>
                                <td>{med.frequency}</td>
                                <td>{med.duration}</td>
                                <td>
                                  <button className="btn btn-sm btn-danger" onClick={() => handleRemoveMedicine(idx)}>Remove</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No medicines added yet</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h6>Add Medicine</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Medicine Name *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="medicine_name"
                          value={newMedicine.medicine_name} 
                          onChange={(e) => setNewMedicine({...newMedicine, medicine_name: e.target.value})}
                          placeholder="Enter medicine name"
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Quantity *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          name="quantity"
                          value={newMedicine.quantity} 
                          onChange={(e) => setNewMedicine({...newMedicine, quantity: parseInt(e.target.value) || 1})} 
                          min="1" 
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Dosage *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="dosage"
                          value={newMedicine.dosage} 
                          onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})} 
                          placeholder="e.g., 500mg" 
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Frequency *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="frequency"
                          value={newMedicine.frequency} 
                          onChange={(e) => setNewMedicine({...newMedicine, frequency: e.target.value})} 
                          placeholder="e.g., 2x daily" 
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Duration *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="duration"
                          value={newMedicine.duration} 
                          onChange={(e) => setNewMedicine({...newMedicine, duration: e.target.value})} 
                          placeholder="e.g., 5 days" 
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <label className="form-label">Notes</label>
                        <textarea 
                          className="form-control" 
                          rows="2" 
                          name="notes"
                          value={newMedicine.notes} 
                          onChange={(e) => setNewMedicine({...newMedicine, notes: e.target.value})} 
                          placeholder="Additional notes for this medicine" 
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <button className="btn btn-primary" onClick={handleAddMedicineToPrescription}>+ Add Medicine to Prescription</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPrescriptionModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleSubmitPrescription} disabled={prescriptionMedicines.length === 0}>
                  Create Prescription ({prescriptionMedicines.length} medicines)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;