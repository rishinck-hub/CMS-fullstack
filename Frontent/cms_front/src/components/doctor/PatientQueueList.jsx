import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import api from '../../services/api';
import ConsultationForm from './ConsultationForm';

const PatientQueueList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctor/appointments/');
      setAppointments(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };


  const handleStartConsultation = (appointment) => {
    setSelectedAppointment(appointment);
    setShowConsultationModal(true);
  };

  const handleConsultationCreated = () => {
    setShowConsultationModal(false);
    setSelectedAppointment(null);
    fetchAppointments();
  };

  return (
    <div className="container-fluid py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
              <h5 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Patient Queue
              </h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading appointments...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4 text-danger">
                  <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={fetchAppointments}>
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Patient Name</th>
                        <th>Phone</th>
                        <th>Appointment Time</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
                        <tr key={appointment.id}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{appointment.patient?.first_name} {appointment.patient?.last_name}</strong>
                          </td>
                          <td>{appointment.patient?.phone || '—'}</td>
                          <td>{new Date(appointment.date_time).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${
                              appointment.status === 'Completed' ? 'bg-success' :
                              appointment.status === 'Cancelled' ? 'bg-danger' :
                              appointment.status === 'in_consultation' ? 'bg-info' :
                              'bg-warning'
                            }`}>
                              {appointment.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{appointment.reason || 'General consultation'}</td>
                          <td>
                            {appointment.status === 'Scheduled' && (
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleStartConsultation(appointment)}
                              >
                                <i className="fas fa-stethoscope me-1"></i>
                                Start Consultation
                              </button>
                            )}
                            {appointment.status === 'Completed' && (
                              <span className="text-success">
                                <i className="fas fa-check-circle me-1"></i>
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length === 0 && (
                    <div className="text-center py-4 text-muted">
                      <i className="fas fa-users fa-2x mb-3"></i>
                      <p>No patients in queue</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Form Modal */}
      {showConsultationModal && selectedAppointment && (
        <ConsultationForm
          appointment={selectedAppointment}
          onConsultationCreated={handleConsultationCreated}
          onClose={() => setShowConsultationModal(false)}
        />
      )}
    </div>
  );
};

export default PatientQueueList;
