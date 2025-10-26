import React, { useState, useEffect } from 'react';

const SimplePharmacyDashboard = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockMedicines: 0,
    totalBillings: 0,
    todayBillings: 0,
    totalRevenue: 0,
    todayRevenue: 0
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/pharmacist/medicinebilling/dashboard_stats/');
      const data = await response.json();
      
      setStats(data.stats);
      setLowStockItems(data.lowStockItems || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Error Loading Dashboard</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadDashboardData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
             Pharmacist Dashboard
          </h1>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card text-center h-100 border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Medicines</h5>
              <h2 className="text-primary">{stats.totalMedicines}</h2>
              <p className="text-muted">Available in inventory</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center h-100 border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">Low Stock Alert</h5>
              <h2 className="text-warning">{stats.lowStockMedicines}</h2>
              <p className="text-muted">Need restocking</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center h-100 border-success">
            <div className="card-body">
              <h5 className="card-title text-success">Total Billings</h5>
              <h2 className="text-success">{stats.totalBillings}</h2>
              <p className="text-muted">All time</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center h-100 border-info">
            <div className="card-body">
              <h5 className="card-title text-info">Today's Revenue</h5>
              <h2 className="text-info">₹{stats.todayRevenue}</h2>
              <p className="text-muted">Total: ₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Items */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">⚠️ Low Stock Medicines</h5>
            </div>
            <div className="card-body">
              {lowStockItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Medicine Name</th>
                        <th>Current Stock</th>
                        <th>Price per Unit</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>
                            <span className="badge bg-danger">{item.stock}</span>
                          </td>
                          <td>₹{item.price_per_unit}</td>
                          <td>
                            <span className="badge bg-warning">Low Stock</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <h5 className="text-success">🎉 All medicines are well stocked!</h5>
                  <p className="text-muted">No low stock alerts at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* <div className="col-md-4">
                  <button className="btn btn-outline-primary w-100">
                    📦 Manage Inventory
                  </button>
                </div> */}
                <div className="col-md-4">
                  <button className="btn btn-outline-success w-100">
                     View Prescription
                  </button>
                </div>
                {/* <div className="col-md-4">
                  <button className="btn btn-outline-info w-100">
                    📊 View Reports
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={loadDashboardData}
          >
            🔄 Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplePharmacyDashboard;


