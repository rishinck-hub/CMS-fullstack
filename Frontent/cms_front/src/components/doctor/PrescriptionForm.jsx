import React, { useState } from 'react';
import { doctorService } from '../../services/doctorService';

const PrescriptsForm = ({ patientId, consultationId, onPrescriptionCreated }) => {
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    patient: patientId,
    consultation: consultationId
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await doctorService.createPrescription(formData);
      setFormData({
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        patient: patientId,
        consultation: consultationId
      });
      onPrescriptionCreated && onPrescriptionCreated();
    } catch (error) {
      console.error('Error creating prescription:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h6 className="mb-0 text-primary">
          <i className="fas fa-prescription me-2"></i>
          Prescription
        </h6>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Medication Name *</label>
              <input
                type="text"
                className="form-control"
                name="medication_name"
                value={formData.medication_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Dosage *</label>
              <input
                type="text"
                className="form-control"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 500mg"
                required
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Frequency *</label>
              <select
                className="form-select"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                <option value="once daily">Once Daily</option>
                <option value="twice daily">Twice Daily</option>
                <option value="three times daily">Three Times Daily</option>
                <option value="four times daily">Four Times Daily</option>
                <option value="as needed">As Needed</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Duration *</label>
              <input
                type="text"
                className="form-control"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 7 days"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Special Instructions</label>
              <input
                type="text"
                className="form-control"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="e.g., Take after meals"
              />
            </div>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Adding Prescription...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Add Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptsForm;