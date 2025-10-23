import React from 'react';

const Schedule = () => {
  // Mock schedule data - replace with actual API call
  const scheduleData = [
    { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 3:00 PM' },
    { day: 'Saturday', hours: 'Emergency Only' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 col-lg-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 text-primary">
                <i className="fas fa-calendar-alt me-2"></i>
                My Schedule
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Day</th>
                      <th>Working Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((schedule, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{schedule.day}</strong>
                        </td>
                        <td>{schedule.hours}</td>
                        <td>
                          <span className={`badge ${
                            schedule.hours === 'Closed' ? 'bg-danger' :
                            schedule.hours === 'Emergency Only' ? 'bg-warning' :
                            'bg-success'
                          }`}>
                            {schedule.hours === 'Closed' ? 'Closed' :
                             schedule.hours === 'Emergency Only' ? 'Limited' :
                             'Available'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="text-primary mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Schedule Information
                </h6>
                <p className="mb-2">
                  <i className="fas fa-clock me-2 text-muted"></i>
                  Regular consultation hours: Monday to Friday, 9:00 AM to 5:00 PM
                </p>
                <p className="mb-2">
                  <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                  Emergency cases are accepted 24/7
                </p>
                <p className="mb-0">
                  <i className="fas fa-phone me-2 text-muted"></i>
                  Contact reception for appointment modifications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;