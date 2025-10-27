import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: 0,
    price_per_unit: 0
  });
  const [stockData, setStockData] = useState({
    change: 0,
    reason: ''
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pharmacist/medicines/');
      setMedicines(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error loading medicines:', err);
      setError('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pharmacist/medicines/', formData);
      setShowAddModal(false);
      setFormData({ name: '', description: '', stock: 0, price_per_unit: 0 });
      loadMedicines();
    } catch (err) {
      console.error('Error adding medicine:', err);
      alert('Failed to add medicine: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleEditMedicine = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/pharmacist/medicines/${selectedMedicine.id}/`, formData);
      setShowEditModal(false);
      setSelectedMedicine(null);
      loadMedicines();
    } catch (err) {
      console.error('Error editing medicine:', err);
      alert('Failed to edit medicine: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/pharmacist/medicines/${selectedMedicine.id}/update_stock/`, stockData);
      setShowStockModal(false);
      setSelectedMedicine(null);
      setStockData({ change: 0, reason: '' });
      loadMedicines();
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteMedicine = async (medicine) => {
    if (window.confirm(`Are you sure you want to delete ${medicine.name}?`)) {
      try {
        await api.delete(`/pharmacist/medicines/${medicine.id}/`);
        loadMedicines();
      } catch (err) {
        console.error('Error deleting medicine:', err);
        alert('Failed to delete medicine: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description,
      stock: medicine.stock,
      price_per_unit: medicine.price_per_unit
    });
    setShowEditModal(true);
  };

  const openStockModal = (medicine) => {
    setSelectedMedicine(medicine);
    setStockData({ change: 0, reason: '' });
    setShowStockModal(true);
  };

  const getStockBadge = (stock) => {
    if (stock < 10) return 'bg-danger';
    if (stock < 50) return 'bg-warning';
    return 'bg-success';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading medicines...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '20px' }}>
        <div className="card-body" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', color: 'white' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2">
                <i className="fas fa-pills me-3"></i>
                Medicine Management
              </h2>
              <p className="mb-0 opacity-75">Manage your pharmacy inventory</p>
            </div>
            <button 
              className="btn btn-light btn-lg"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Add Medicine
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {/* Medicines Table */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
        <div className="card-header py-3 border-0" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '20px 20px 0 0', color: 'white' }}>
          <h5 className="mb-0">💊 Medicine Inventory ({medicines.length})</h5>
        </div>
        <div className="card-body">
          {medicines.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Medicine Name</th>
                    <th>Description</th>
                    <th>Stock</th>
                    <th>Price per Unit</th>
                    <th>Total Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <tr key={medicine.id}>
                      <td>
                        <strong>{medicine.name}</strong>
                      </td>
                      <td>
                        <small className="text-muted">{medicine.description || '—'}</small>
                      </td>
                      <td>
                        <span className={`badge ${getStockBadge(medicine.stock)}`}>
                          {medicine.stock}
                        </span>
                      </td>
                      <td>₹{medicine.price_per_unit}</td>
                      <td>₹{(medicine.stock * medicine.price_per_unit).toFixed(2)}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(medicine)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => openStockModal(medicine)}
                          >
                            <i className="fas fa-boxes"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteMedicine(medicine)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-pills fa-3x mb-3"></i>
              <p>No medicines found. Add some medicines to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  Add New Medicine
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddMedicine}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Medicine Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Initial Stock *</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Price per Unit (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={formData.price_per_unit}
                          onChange={(e) => setFormData({...formData, price_per_unit: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    Add Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditModal && selectedMedicine && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Edit Medicine
                </h5>
                <button 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditMedicine}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Medicine Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Stock *</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Price per Unit (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={formData.price_per_unit}
                          onChange={(e) => setFormData({...formData, price_per_unit: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    <i className="fas fa-save me-2"></i>
                    Update Medicine
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showStockModal && selectedMedicine && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-boxes me-2"></i>
                  Update Stock - {selectedMedicine.name}
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowStockModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateStock}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <strong>Current Stock:</strong> {selectedMedicine.stock} units
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock Change *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={stockData.change}
                      onChange={(e) => setStockData({...stockData, change: parseInt(e.target.value) || 0})}
                      placeholder="Positive to add, negative to subtract"
                      required
                    />
                    <div className="form-text">
                      Enter positive number to add stock, negative to subtract
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason *</label>
                    <select
                      className="form-select"
                      value={stockData.reason}
                      onChange={(e) => setStockData({...stockData, reason: e.target.value})}
                      required
                    >
                      <option value="">Select reason</option>
                      <option value="Restocked">Restocked</option>
                      <option value="Manual adjustment">Manual adjustment</option>
                      <option value="Damaged goods">Damaged goods</option>
                      <option value="Expired">Expired</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="alert alert-warning">
                    <strong>New Stock:</strong> {selectedMedicine.stock + (stockData.change || 0)} units
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-save me-2"></i>
                    Update Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineManagement;
