import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkingDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from API...');
      
      const response = await fetch('http://localhost:8000/api/pharmacist/medicinebilling/dashboard_stats/');
      console.log('Response received:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Data received:', result);
        setData(result);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>🔄 Loading Dashboard...</h2>
        <p>Please wait while we fetch your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>❌ Error Loading Dashboard</h2>
        <p>Error: {error}</p>
        <button 
          onClick={loadData}
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
         Pharmacist Dashboard 
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          border: '2px solid #007bff', 
          borderRadius: '10px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ color: '#007bff' }}>Total Medicines</h3>
          <h1 style={{ fontSize: '2.5em', margin: '10px 0' }}>{data?.stats?.totalMedicines || 0}</h1>
          <p style={{ color: '#666' }}>Available in inventory</p>
        </div>

        <div style={{ 
          border: '2px solid #ffc107', 
          borderRadius: '10px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#fff3cd'
        }}>
          <h3 style={{ color: '#856404' }}>Low Stock Alert</h3>
          <h1 style={{ fontSize: '2.5em', margin: '10px 0' }}>{data?.stats?.lowStockMedicines || 0}</h1>
          <p style={{ color: '#666' }}>Need restocking</p>
        </div>

        <div style={{ 
          border: '2px solid #28a745', 
          borderRadius: '10px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#d4edda'
        }}>
          <h3 style={{ color: '#155724' }}>Total Billings</h3>
          <h1 style={{ fontSize: '2.5em', margin: '10px 0' }}>{data?.stats?.totalBillings || 0}</h1>
          <p style={{ color: '#666' }}>All time</p>
        </div>

        <div style={{ 
          border: '2px solid #17a2b8', 
          borderRadius: '10px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#d1ecf1'
        }}>
          <h3 style={{ color: '#0c5460' }}>Today's Revenue</h3>
          <h1 style={{ fontSize: '2.5em', margin: '10px 0' }}>₹{data?.stats?.todayRevenue || 0}</h1>
          <p style={{ color: '#666' }}>Total: ₹{data?.stats?.totalRevenue || 0}</p>
        </div>
      </div>

      {data?.lowStockItems && data.lowStockItems.length > 0 && (
        <div style={{ 
          border: '2px solid #ffc107', 
          borderRadius: '10px', 
          padding: '20px',
          backgroundColor: '#fff3cd'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '20px' }}>⚠️ Low Stock Medicines</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {data.lowStockItems.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}>
                <div>
                  <strong>{item.name}</strong>
                  <br />
                  <small style={{ color: '#666' }}>{item.description}</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    padding: '5px 10px', 
                    borderRadius: '15px',
                    fontSize: '0.9em'
                  }}>
                    Stock: {item.stock}
                  </span>
                  <br />
                  <small style={{ color: '#666' }}>₹{item.price_per_unit}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button 
          onClick={loadData}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          🔄 Refresh Dashboard
        </button>
        <button 
          onClick={() => navigate('/test-medicine-management')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          💊 Manage Medicines
        </button>
        <button 
          onClick={() => navigate('/test-billing-management')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          💳 Billing Management
        </button>
        <button 
          onClick={() => navigate('/test-prescription-viewer')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#fd7e14', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          📋 View Prescriptions
        </button>
        <button 
          onClick={() => navigate('/test-billing-prescription')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#6f42c1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          🏥 Combined View
        </button>
        <button 
          onClick={() => navigate('/simple-billing')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#20c997', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          💳 Simple Billing
        </button>
        <button 
          onClick={() => navigate('/simple-prescriptions')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#fd7e14', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          📋 Simple Prescriptions
        </button>
        <button 
          onClick={() => navigate('/working-billing-prescription')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#e83e8c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          🏥 Working System
        </button>
        {/* <button 
          onClick={() => navigate('/final-working-system')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          🚀 FINAL SYSTEM
        </button> */}
        {/* <button 
          onClick={() => navigate('/old-style-system')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          📁 OLD STYLE
        </button> */}
        {/* <button 
          onClick={() => navigate('/original-dummy-system')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginRight: '10px'
          }}
        >
          📋 ORIGINAL DUMMY
        </button> */}
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em'
          }}
        >
          🏠 Main Dashboard
        </button>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        {/* <h4>🎉 Dashboard is Working!</h4>
        <p>Your pharmacist dashboard is successfully connected to the backend database.</p>
        <p><strong>Backend:</strong> http://localhost:8000 ✅</p>
        <p><strong>Frontend:</strong> http://localhost:5173 ✅</p> */}
      </div>
    </div>
  );
};

export default WorkingDashboard;
