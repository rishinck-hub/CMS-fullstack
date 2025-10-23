import React, { useState, useEffect } from 'react';
import PrescriptsForm from '../../components/doctor/PrescriptionForm';
import { doctorService } from '../../services/doctorService';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await doctorService.getConsultations();
      setConsultations(response.data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 text-primary">
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
                              <span className={`badge ${
                                consultation.status === 'completed' ? 'bg-success' :
                                consultation.status === 'in_progress' ? 'bg-warning' :
                                'bg-primary'
                              }`}>
                                {consultation.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </small>
                          </div>
                          <p className="mb-1">{consultation.chief_complaint}</p>
                          <small>
                            {new Date(consultation.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
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
                            <p><strong>Chief Complaint:</strong> {selectedConsultation.chief_complaint}</p>
                            <p><strong>Diagnosis:</strong> {selectedConsultation.diagnosis || 'Not specified'}</p>
                            <p><strong>Notes:</strong> {selectedConsultation.notes || 'No notes'}</p>
                          </div>
                        </div>
                        
                        <PrescriptsForm
                          patientId={selectedConsultation.patient}
                          consultationId={selectedConsultation.id}
                          onPrescriptionCreated={() => {
                            // Refresh consultations or show success message
                            fetchConsultations();
                          }}
                        />
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
    </div>
  );
};

export default Consultations;