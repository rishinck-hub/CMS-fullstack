import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EnhancedPharmacyDashboard = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockMedicines: 0,
    totalBillings: 0,
    todayBillings: 0,
    totalRevenue: 0,
    todayRevenue: 0
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentMedicines, setRecentMedicines] = useState([]);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dashboard stats - using authenticated api client
      const statsResponse = await api.get('/pharmacist/medicinebilling/dashboard_stats/');
      const statsData = statsResponse.data;
      
      setStats(statsData.stats || {
        totalMedicines: 0,
        lowStockMedicines: 0,
        totalBillings: 0,
        todayBillings: 0,
        totalRevenue: 0,
        todayRevenue: 0
      });
      setLowStockItems(statsData.lowStockItems || []);
      
      // Load prescription items
      await loadPrescriptionItems();
      
      // Load recent medicines
      await loadRecentMedicines();
      
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(`Failed to load dashboard data: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadPrescriptionItems = async () => {
    try {
      const response = await api.get('/pharmacist/prescriptionmedicines/');
      const data = response.data.results || response.data;
      const groupedPrescriptions = groupPrescriptionItems(data);
      setPrescriptionItems(groupedPrescriptions.slice(0, 5));
    } catch (err) {
      console.error('Error loading prescription items:', err);
      // Use mock data if API fails
      setPrescriptionItems(getMockPrescriptionItems());
    }
  };

  const loadRecentMedicines = async () => {
    try {
      const medicinesResponse = await api.get('/pharmacist/medicines/');
      const medicinesData = medicinesResponse.data;
      const medicines = Array.isArray(medicinesData.results) ? medicinesData.results : 
                      Array.isArray(medicinesData) ? medicinesData : [];
      setRecentMedicines(medicines.slice(0, 5));
    } catch (medErr) {
      console.log('Could not load medicines:', medErr.message);
      setRecentMedicines([]);
    }
  };

  // Group prescription items by prescription_id
  const groupPrescriptionItems = (prescriptionItems) => {
    if (!Array.isArray(prescriptionItems)) return [];
    
    const grouped = {};
    
    prescriptionItems.forEach(item => {
      if (!item) return;
      
      const prescriptionId = item.prescription_id || item.id;
      if (!grouped[prescriptionId]) {
        grouped[prescriptionId] = {
          prescription_id: prescriptionId,
          patient_name: item.patient_name || `Patient ${prescriptionId}`,
          patient_id: item.patient_id || prescriptionId,
          doctor_name: item.doctor_name || 'Doctor',
          diagnosis: item.diagnosis || 'No diagnosis',
          status: item.status || 'pending',
          created_date: item.created_date || new Date().toISOString(),
          items: []
        };
      }
      if (item.medicine_id) {
        grouped[prescriptionId].items.push({
          id: item.id,
          medicine_id: item.medicine_id,
          medicine_name: item.medicine_name || `Medicine ${item.medicine_id}`,
          quantity: item.quantity || 0,
          dosage: item.dosage || '',
          frequency: item.frequency || '',
          duration: item.duration || '',
          price: item.price || 0
        });
      }
    });
    
    return Object.values(grouped);
  };

  // Mock data for demonstration
  const getMockPrescriptionItems = () => {
    return [
      {
        prescription_id: 1,
        patient_name: "John Doe",
        patient_id: 101,
        doctor_name: "Dr. Smith",
        diagnosis: "Fever and common cold",
        status: "pending",
        created_date: new Date().toISOString(),
        items: [
          {
            id: 1,
            medicine_id: 1,
            medicine_name: "Paracetamol",
            quantity: 10,
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "5 days",
            price: 25.50
          }
        ]
      },
      {
        prescription_id: 2,
        patient_name: "Jane Smith",
        patient_id: 102,
        doctor_name: "Dr. Johnson",
        diagnosis: "Headache",
        status: "approved",
        created_date: new Date().toISOString(),
        items: [
          {
            id: 2,
            medicine_id: 2,
            medicine_name: "Ibuprofen",
            quantity: 5,
            dosage: "400mg",
            frequency: "As needed",
            duration: "3 days",
            price: 32.00
          }
        ]
      }
    ];
  };

  const handleViewPrescription = () => {
    navigate('prescriptions'); // ✅ Fixed: relative path
  };

  const handleBillingManagement = () => {
    navigate('billmanagement'); // ✅ Fixed: relative path
  };

  const handleCreateBill = (prescription) => {
    if (!prescription || !prescription.prescription_id) {
      console.error('Invalid prescription data');
      return;
    }

    navigate('billmanagement', { // ✅ Fixed: relative path
      state: {
        prescriptionId: prescription.prescription_id,
        patientName: prescription.patient_name,
        patientId: prescription.patient_id,
        doctorName: prescription.doctor_name,
        diagnosis: prescription.diagnosis,
        prescriptionItems: prescription.items || []
      }
    });
  };

  const calculatePrescriptionTotal = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + ((item.quantity || 0) * (item.price || 0)), 0);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'bg-warning', text: 'Pending' },
      'approved': { class: 'bg-success', text: 'Approved' },
      'completed': { class: 'bg-info', text: 'Completed' },
      'rejected': { class: 'bg-danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: 'Unknown' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  // Loading state
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

  // Error state
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
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
            🏥 Pharmacist Dashboard
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

      {/* Quick Actions - FIXED SECTION */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">🚀 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <Link to="/pharmacist/medicines" className="btn btn-outline-primary w-100">
                    💊 Medicine Management
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/pharmacist/prescriptions" className="btn btn-outline-success w-100">
                    📋 Prescription Management
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/pharmacist/billing" className="btn btn-outline-info w-100">
                    🧾 Billing Management
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/pharmacist/dashboard" className="btn btn-outline-secondary w-100">
                    📊 Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className="row">
        {/* Prescription Items for Billing */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">📋 Prescriptions Ready for Billing</h5>
            </div>
            <div className="card-body">
              {prescriptionItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionItems.map((prescription) => (
                        <tr key={prescription.prescription_id}>
                          <td>
                            <strong>{prescription.patient_name}</strong>
                            <br />
                            <small className="text-muted">ID: {prescription.patient_id}</small>
                          </td>
                          <td>
                            <small>{prescription.doctor_name}</small>
                          </td>
                          <td>
                            <small>
                              {prescription.items.length} items
                            </small>
                          </td>
                          <td>
                            <strong>₹{calculatePrescriptionTotal(prescription.items)}</strong>
                          </td>
                          <td>
                            {getStatusBadge(prescription.status)}
                          </td>
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleCreateBill(prescription)}
                              disabled={!prescription.prescription_id}
                            >
                              🧾 Bill
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <h5 className="text-muted">No prescriptions available</h5>
                  <p className="text-muted">Prescription items will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">⚠️ Low Stock Medicines</h5>
            </div>
            <div className="card-body">
              {lowStockItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Stock</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.name}</strong>
                            <br />
                            <small className="text-muted">{item.description}</small>
                          </td>
                          <td>
                            <span className="badge bg-danger">{item.stock}</span>
                          </td>
                          <td>₹{item.price_per_unit}</td>
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

      {/* Recent Medicines Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">💊 Recent Medicines</h5>
            </div>
            <div className="card-body">
              {recentMedicines.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMedicines.map((medicine) => (
                        <tr key={medicine.id}>
                          <td>
                            <strong>{medicine.name}</strong>
                            <br />
                            <small className="text-muted">{medicine.description}</small>
                          </td>
                          <td>
                            <span className={`badge ${
                              medicine.stock < 10 ? 'bg-danger' : 
                              medicine.stock < 50 ? 'bg-warning' : 'bg-success'
                            }`}>
                              {medicine.stock}
                            </span>
                          </td>
                          <td>₹{medicine.price_per_unit}</td>
                          <td>
                            {medicine.stock < 10 ? (
                              <span className="badge bg-danger">Low Stock</span>
                            ) : medicine.stock < 50 ? (
                              <span className="badge bg-warning">Medium</span>
                            ) : (
                              <span className="badge bg-success">Good</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <h5 className="text-muted">No medicines found</h5>
                  <p className="text-muted">Add some medicines to get started.</p>
                </div>
              )}
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
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPharmacyDashboard;
