import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';

const PatientQueueList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorService.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async (appointmentId) => {
    try {
      await doctorService.updateAppointment(appointmentId, { status: 'in_consultation' });
      fetchAppointments();
    } catch (error) {
      console.error('Error starting consultation:', error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 text-primary">
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
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Patient Name</th>
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
                            <strong>{appointment.patient_name}</strong>
                          </td>
                          <td>{new Date(appointment.date).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${
                              appointment.status === 'waiting' ? 'bg-warning' :
                              appointment.status === 'in_consultation' ? 'bg-info' :
                              'bg-success'
                            }`}>
                              {appointment.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{appointment.reason}</td>
                          <td>
                            {appointment.status === 'waiting' && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => startConsultation(appointment.id)}
                              >
                                <i className="fas fa-play me-1"></i>
                                Start Consultation
                              </button>
                            )}
                            {appointment.status === 'in_consultation' && (
                              <a
                                href={`/doctor/consultation/${appointment.id}`}
                                className="btn btn-success btn-sm"
                              >
                                <i className="fas fa-stethoscope me-1"></i>
                                Continue
                              </a>
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
    </div>
  );
};

export default PatientQueueList;
