import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestMedicineManagement = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    stock: '',
    price_per_unit: ''
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/pharmacist/medicines/');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Error loading medicines:', err);
      setError(err.message);
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
      const response = await fetch('http://localhost:8000/api/pharmacist/medicines/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadMedicines();
        setFormData({ name: '', description: '', stock: '', price_per_unit: '' });
        setShowForm(false);
        alert('Medicine added successfully! Redirecting to dashboard...');
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
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/pharmacist/medicines/${medicineId}/`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadMedicines();
          alert('Medicine deleted successfully! Redirecting to dashboard...');
          // Redirect to pharmacy dashboard after 2 seconds
          setTimeout(() => {
            navigate('/working-dashboard');
          }, 2000);
        } else {
          throw new Error('Failed to delete medicine');
        }
      } catch (err) {
        console.error('Error deleting medicine:', err);
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>🔄 Loading Medicines...</h2>
        <p>Please wait while we fetch your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>❌ Error Loading Medicines</h2>
        <p>Error: {error}</p>
        <button 
          onClick={loadMedicines}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#007bff', marginBottom: '30px' }}>
         Medicine Management 
      </h1>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <h3>Total Medicines: {medicines.length}</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/working-dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📊 Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🏠 Main Dashboard
          </button>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ➕ Add New Medicine
          </button>
        </div>
      </div>

      {/* Add Medicine Form */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Add New Medicine</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Medicine Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="e.g., Pain relief and fever reducer"
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Current Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="e.g., 100"
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price per Unit (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="e.g., 2.50"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medicines List */}
      <div style={{
        border: '2px solid #007bff',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0 }}>📋 Medicine Inventory ({medicines.length} items)</h3>
        </div>
        
        {medicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h4 style={{ color: '#666' }}>No medicines found</h4>
            <p style={{ color: '#666' }}>Add your first medicine to get started</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{medicine.id}</td>
                    <td style={{ padding: '12px' }}>
                      <strong>{medicine.name}</strong>
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {medicine.description || 'No description'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        backgroundColor: medicine.stock < 10 ? '#dc3545' : 
                                       medicine.stock < 50 ? '#ffc107' : '#28a745',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.9em'
                      }}>
                        {medicine.stock}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <strong>₹{medicine.price_per_unit}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {medicine.stock < 10 ? (
                        <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Low Stock</span>
                      ) : medicine.stock < 50 ? (
                        <span style={{ color: '#ffc107', fontWeight: 'bold' }}>Medium</span>
                      ) : (
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>Good</span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleDelete(medicine.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        {/* <Link to="/pharmacist/dashboard" className="btn btn-outline-primary w-100">
                     Go to Medicine Management Page
                  </Link> */}
        {/* <h4>🎉 Medicine Management is Working!</h4>
        <p>You can now add, view, and delete medicines successfully.</p>
        <p><strong>Backend:</strong> http://localhost:8000 ✅</p>
        <p><strong>Frontend:</strong> http://localhost:5173 ✅</p> */}
      </div>
    </div>
  );
};

export default TestMedicineManagement;
