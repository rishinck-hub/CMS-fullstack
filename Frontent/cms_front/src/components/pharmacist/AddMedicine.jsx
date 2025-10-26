import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddMedicine = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: '',
    price_per_unit: ''
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    // Filter medicines based on search term
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [medicines, searchTerm]);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/pharmacist/medicines/');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data.results || data);
      } else if (response.status === 401) {
        setError('Authentication required. Please log in to manage medicines.');
      } else {
        throw new Error(`Failed to load medicines: ${response.status}`);
      }
    } catch (err) {
      console.error('Error loading medicines:', err);
      setError(`Failed to load medicines: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMedicine 
        ? `http://localhost:8000/api/pharmacist/medicines/${editingMedicine.id}/`
        : 'http://localhost:8000/api/pharmacist/medicines/';
      
      const method = editingMedicine ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadMedicines();
        resetForm();
        setShowForm(false);
        setEditingMedicine(null);
        alert('Medicine saved successfully! Redirecting to dashboard...');
        // Redirect to pharmacy dashboard after 2 seconds
        setTimeout(() => {
          navigate('/working-dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save medicine');
      }
    } catch (err) {
      console.error('Error saving medicine:', err);
      setError(err.message);
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      description: medicine.description,
      stock: medicine.stock.toString(),
      price_per_unit: medicine.price_per_unit.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/pharmacist/medicines/${medicineId}/`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadMedicines();
        } else {
          throw new Error('Failed to delete medicine');
        }
      } catch (err) {
        console.error('Error deleting medicine:', err);
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      stock: '',
      price_per_unit: ''
    });
    setEditingMedicine(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center text-primary mb-4">
             Medicine Management
          </h1>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Search and Add Button */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search medicines by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-primary w-100"
            onClick={() => setShowForm(true)}
          >
            ➕ Add New Medicine
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-info w-100"
            onClick={() => navigate('/working-dashboard')}
          >
            📊 Go to Dashboard
          </button>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-secondary w-100"
            onClick={() => navigate('/')}
          >
            🏠 Main Dashboard
          </button>
        </div>
      </div>

      {/* Medicine Form Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingMedicine ? '✏️ Edit Medicine' : '➕ Add New Medicine'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Medicine Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Paracetamol 500mg"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price per Unit (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price_per_unit"
                        value={formData.price_per_unit}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 2.50"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Current Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="e.g., Pain relief and fever reducer"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Medicines Table */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📋 Medicine Inventory ({filteredMedicines.length} items)</h5>
        </div>
        <div className="card-body p-0">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No medicines found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first medicine to get started'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Medicine Name</th>
                    <th>Description</th>
                    <th>Stock</th>
                    <th>Price (₹)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id}>
                      <td>{medicine.id}</td>
                      <td>
                        <strong>{medicine.name}</strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          {medicine.description || 'No description'}
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${
                          medicine.stock < 10 ? 'bg-danger' : 
                          medicine.stock < 50 ? 'bg-warning' : 'bg-success'
                        }`}>
                          {medicine.stock}
                        </span>
                      </td>
                      <td>
                        <strong>₹{medicine.price_per_unit}</strong>
                      </td>
                      <td>
                        {medicine.stock < 10 ? (
                          <span className="badge bg-danger">Low Stock</span>
                        ) : medicine.stock < 50 ? (
                          <span className="badge bg-warning">Medium Stock</span>
                        ) : (
                          <span className="badge bg-success">In Stock</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(medicine)}
                            title="Edit Medicine"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(medicine.id)}
                            title="Delete Medicine"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h5 className="text-primary">Total Medicines</h5>
              <h3 className="text-primary">{medicines.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">Low Stock</h5>
              <h3 className="text-warning">
                {medicines.filter(m => m.stock < 10).length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">In Stock</h5>
              <h3 className="text-success">
                {medicines.filter(m => m.stock >= 50).length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">Total Value</h5>
              <h3 className="text-info">
                ₹{medicines.reduce((sum, m) => sum + (m.stock * parseFloat(m.price_per_unit)), 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;
