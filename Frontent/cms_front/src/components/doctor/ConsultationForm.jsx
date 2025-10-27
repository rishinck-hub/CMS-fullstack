import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ConsultationForm = ({ appointment, onConsultationCreated, onClose }) => {
  const [consultationData, setConsultationData] = useState({
    symptoms: '',
    diagnosis: '',
    notes: ''
  });
  const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    medicine_name: '',
    quantity: 1,
    dosage: '',
    frequency: '',
    duration: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Consultation, 2: Prescription

  const handleConsultationChange = (e) => {
    setConsultationData({
      ...consultationData,
      [e.target.name]: e.target.value
    });
  };

  const handleMedicineChange = (e) => {
    setNewMedicine({
      ...newMedicine,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMedicine = () => {
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

  const handleSubmitConsultation = async () => {
    if (!consultationData.symptoms || !consultationData.diagnosis) {
      alert('Please fill in symptoms and diagnosis');
      return;
    }

    try {
      setLoading(true);
      
      // Get doctor id from the user
      console.log('Fetching doctor profile from /admin/me/');
      const doctorProfile = await api.get('/admin/me/');
      console.log('Doctor profile response:', doctorProfile.data);
      const doctorId = doctorProfile.data.profile?.id;
      
      if (!doctorId) {
        alert('Doctor profile not found');
        return;
      }
      
      // Create consultation
      const consultationResponse = await api.post('/doctor/consultations/', {
        appointment: appointment.id,
        doctor: doctorId,
        patient: appointment.patient.id, // Send just the ID, not the full object
        symptoms: consultationData.symptoms,
        diagnosis: consultationData.diagnosis,
        notes: consultationData.notes
      });
      
      // Update appointment status to completed
      await api.patch(`/doctor/appointments/${appointment.id}/`, { status: 'Completed' });
      
      // If medicines are added, create prescription
      if (prescriptionMedicines.length > 0) {
        const prescriptionResponse = await api.post('/doctor/prescriptions/', {
          consultation: consultationResponse.data.id,
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
      }
      
      alert('Consultation and prescription created successfully!');
      onConsultationCreated && onConsultationCreated();
      onClose && onClose();
    } catch (err) {
      alert('Failed to create consultation: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!consultationData.symptoms || !consultationData.diagnosis) {
      alert('Please fill in symptoms and diagnosis before proceeding');
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-stethoscope me-2"></i>
              Consultation & Prescription - {appointment?.patient?.first_name} {appointment?.patient?.last_name}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Step Indicator */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-center">
                  <div className="step-indicator">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                      <span className="step-number">1</span>
                      <span className="step-label">Consultation</span>
                    </div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                      <span className="step-number">2</span>
                      <span className="step-label">Prescription</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Consultation Form */}
            {step === 1 && (
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-user-md me-2"></i>
                        Consultation Details
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Patient Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={`${appointment?.patient?.first_name} ${appointment?.patient?.last_name}`}
                            disabled
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Appointment Time</label>
                          <input
                            type="text"
                            className="form-control"
                            value={new Date(appointment?.date_time).toLocaleString()}
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Symptoms *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          name="symptoms"
                          value={consultationData.symptoms}
                          onChange={handleConsultationChange}
                          placeholder="Describe the patient's symptoms..."
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Diagnosis *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          name="diagnosis"
                          value={consultationData.diagnosis}
                          onChange={handleConsultationChange}
                          placeholder="Enter your diagnosis..."
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Additional Notes</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="notes"
                          value={consultationData.notes}
                          onChange={handleConsultationChange}
                          placeholder="Any additional notes or recommendations..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Prescription Form */}
            {step === 2 && (
              <div className="row">
                <div className="col-12">
                  {/* Current Prescription Medicines */}
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-prescription-bottle-alt me-2"></i>
                        Prescribed Medicines ({prescriptionMedicines.length})
                      </h6>
                    </div>
                    <div className="card-body">
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
                                <th>Notes</th>
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
                                  <td>{med.notes || '—'}</td>
                                  <td>
                                    <button 
                                      className="btn btn-sm btn-danger" 
                                      onClick={() => handleRemoveMedicine(idx)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center text-muted py-3">
                          <i className="fas fa-pills fa-2x mb-2"></i>
                          <p>No medicines added yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Medicine Form */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-plus me-2"></i>
                        Add Medicine
                      </h6>
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
                            onChange={handleMedicineChange}
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
                            onChange={handleMedicineChange} 
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
                            onChange={handleMedicineChange} 
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
                            onChange={handleMedicineChange} 
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
                            onChange={handleMedicineChange} 
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
                            onChange={handleMedicineChange} 
                            placeholder="Additional notes for this medicine" 
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <button 
                          className="btn btn-primary" 
                          onClick={handleAddMedicine}
                        >
                          <i className="fas fa-plus me-2"></i>
                          Add Medicine to Prescription
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {step === 1 && (
              <button className="btn btn-primary" onClick={handleNextStep}>
                Next: Add Prescription
                <i className="fas fa-arrow-right ms-2"></i>
              </button>
            )}
            {step === 2 && (
              <>
                <button className="btn btn-outline-primary" onClick={handlePrevStep}>
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Consultation
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={handleSubmitConsultation}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Complete Consultation & Prescription
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .step-indicator {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }
        
        .step.active {
          opacity: 1;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #6c757d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .step.active .step-number {
          background: #0d6efd;
        }
        
        .step-label {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 100%;
          width: 2rem;
          height: 2px;
          background: #6c757d;
          margin-left: 1rem;
        }
        
        .step.active:not(:last-child)::after {
          background: #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default ConsultationForm;
