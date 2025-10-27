import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let url = '/doctor/appointments/';
      
      if (filter === 'today') {
        url = '/doctor/appointments/today/';
      }
      
      const response = await api.get(url);
      let data = response.data || [];
      
      // Apply additional filters if needed
      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        data = data.filter(apt => new Date(apt.date_time) >= weekAgo);
      } else if (filter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        data = data.filter(apt => new Date(apt.date_time) >= monthAgo);
      }
      
      setAppointments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'Cancelled':
        return 'bg-danger';
      case 'in_consultation':
        return 'bg-info';
      case 'Scheduled':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  const getFilterCounts = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return {
      all: appointments.length,
      today: appointments.filter(apt => {
        const aptDate = new Date(apt.date_time);
        return aptDate.toDateString() === today.toDateString();
      }).length,
      week: appointments.filter(apt => new Date(apt.date_time) >= weekAgo).length,
      month: appointments.filter(apt => new Date(apt.date_time) >= monthAgo).length
    };
  };

  const counts = getFilterCounts();

  return (
    <div className="container-fluid py-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
              <h5 className="mb-0">
                <i className="fas fa-calendar-alt me-2"></i>
                Doctor Schedule
              </h5>
            </div>
            <div className="card-body">
              {/* Filter Buttons */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('all')}
                    >
                      All ({counts.all})
                    </button>
                    <button
                      type="button"
                      className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('today')}
                    >
                      Today ({counts.today})
                    </button>
                    <button
                      type="button"
                      className={`btn ${filter === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('week')}
                    >
                      This Week ({counts.week})
                    </button>
                    <button
                      type="button"
                      className={`btn ${filter === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('month')}
                    >
                      This Month ({counts.month})
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading schedule...</p>
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
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Reason</th>
                        <th>Doctor</th>
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
                          <td>
                            <div>
                              <div>{new Date(appointment.date_time).toLocaleDateString()}</div>
                              <small className="text-muted">
                                {new Date(appointment.date_time).toLocaleTimeString()}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                              {appointment.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{appointment.reason || 'General consultation'}</td>
                          <td>
                            {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length === 0 && (
                    <div className="text-center py-4 text-muted">
                      <i className="fas fa-calendar-alt fa-2x mb-3"></i>
                      <p>No appointments found for the selected period</p>
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

export default Schedule;