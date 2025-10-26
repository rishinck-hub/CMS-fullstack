// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const BillManagement = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [billItems, setBillItems] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // Get prescription data passed from dashboard
//   const prescriptionData = location.state || {};

//   const { 
//     prescriptionId, 
//     patientName = 'Patient', 
//     patientId = 'N/A', 
//     doctorName = 'Doctor', 
//     diagnosis = 'No diagnosis',
//     prescriptionItems = []
//   } = prescriptionData;

//   useEffect(() => {
//     // Redirect back if no prescription data
//     if (!prescriptionId) {
//       console.warn('No prescription data found, redirecting to dashboard');
//       navigate('/test-pharmacist');
//       return;
//     }

//     // Initialize bill items from prescription items
//     if (prescriptionItems.length > 0) {
//       const initialBillItems = prescriptionItems.map(item => ({
//         id: item.id,
//         medicine_id: item.medicine_id,
//         medicine_name: item.medicine_name,
//         prescribed_quantity: item.quantity || 0,
//         actual_quantity: item.quantity || 0,
//         price: item.price || 0,
//         total: ((item.quantity || 0) * (item.price || 0)),
//         dosage: item.dosage || '',
//         frequency: item.frequency || '',
//         duration: item.duration || ''
//       }));
//       setBillItems(initialBillItems);
//       calculateTotal(initialBillItems);
//     }
//   }, [prescriptionItems, prescriptionId, navigate]);

//   const calculateTotal = (items = billItems) => {
//     const total = items.reduce((sum, item) => sum + (item.actual_quantity * item.price), 0);
//     setTotalAmount(total);
//   };

//   const updateQuantity = (index, newQuantity) => {
//     const newItems = [...billItems];
//     newItems[index].actual_quantity = parseInt(newQuantity) || 0;
//     newItems[index].total = newItems[index].actual_quantity * newItems[index].price;
//     setBillItems(newItems);
//     calculateTotal(newItems);
//   };

//   const updatePrice = (index, newPrice) => {
//     const newItems = [...billItems];
//     newItems[index].price = parseFloat(newPrice) || 0;
//     newItems[index].total = newItems[index].actual_quantity * newItems[index].price;
//     setBillItems(newItems);
//     calculateTotal(newItems);
//   };

//   const removeItem = (index) => {
//     const newItems = billItems.filter((_, i) => i !== index);
//     setBillItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addNewMedicine = () => {
//     const newItem = {
//       id: Date.now(), // temporary ID
//       medicine_id: null,
//       medicine_name: '',
//       prescribed_quantity: 0,
//       actual_quantity: 0,
//       price: 0,
//       total: 0,
//       dosage: '',
//       frequency: '',
//       duration: ''
//     };
//     setBillItems([...billItems, newItem]);
//   };

//   const handleGenerateBill = async () => {
//     if (billItems.length === 0) {
//       alert('Please add at least one medicine to generate bill.');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Create billing record
//       const billingResponse = await fetch('http://localhost:8000/api/pharmacist/medicinebilling/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           prescription_id: prescriptionId,
//           patient_id: patientId,
//           total_medicine_fee: totalAmount,
//           created_by_id: 1, // You might want to get this from authentication
//           billing_items: billItems.map(item => ({
//             medicine_id: item.medicine_id,
//             quantity: item.actual_quantity,
//             price: item.price,
//             total: item.total
//           }))
//         })
//       });

//       if (billingResponse.ok) {
//         const result = await billingResponse.json();
//         alert('Bill generated successfully!');
//         console.log('Bill created:', result);
//         navigate('/test-pharmacist');
//       } else {
//         const errorData = await billingResponse.json();
//         throw new Error(errorData.message || 'Failed to generate bill');
//       }
//     } catch (error) {
//       console.error('Error generating bill:', error);
//       alert('Error generating bill: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show loading if no prescription data yet
//   if (!prescriptionId && location.state === undefined) {
//     return (
//       <div className="container mt-4">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading billing information...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!prescriptionId) {
//     return (
//       <div className="container mt-4">
//         <div className="alert alert-warning text-center">
//           <h4>No Prescription Selected</h4>
//           <p>Please select a prescription from the dashboard to create a bill.</p>
//           <button 
//             className="btn btn-primary mt-3"
//             onClick={() => navigate('/test-pharmacist')}
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="text-primary">🧾 Billing Management</h2>
//         <button 
//           className="btn btn-outline-secondary"
//           onClick={() => navigate('/test-pharmacist')}
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

//       <div className="card">
//         <div className="card-header bg-primary text-white">
//           <h5 className="mb-0">Create Bill - Prescription #{prescriptionId}</h5>
//         </div>
//         <div className="card-body">
//           {/* Patient and Prescription Information */}
//           <div className="row mb-4">
//             <div className="col-md-6">
//               <div className="card">
//                 <div className="card-header bg-light">
//                   <h6 className="mb-0">Patient Information</h6>
//                 </div>
//                 <div className="card-body">
//                   <p className="mb-1"><strong>Name:</strong> {patientName}</p>
//                   <p className="mb-0"><strong>Patient ID:</strong> {patientId}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="card">
//                 <div className="card-header bg-light">
//                   <h6 className="mb-0">Prescription Details</h6>
//                 </div>
//                 <div className="card-body">
//                   <p className="mb-1"><strong>Doctor:</strong> {doctorName}</p>
//                   <p className="mb-1"><strong>Diagnosis:</strong> {diagnosis}</p>
//                   <p className="mb-0"><strong>Prescription ID:</strong> {prescriptionId}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Billing Items Section */}
//           <div className="row">
//             <div className="col-12">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h5>Bill Items</h5>
//                 <button 
//                   className="btn btn-outline-primary btn-sm"
//                   onClick={addNewMedicine}
//                 >
//                   + Add Medicine
//                 </button>
//               </div>
              
//               {billItems.length > 0 ? (
//                 <div className="table-responsive">
//                   <table className="table table-bordered table-hover">
//                     <thead className="table-light">
//                       <tr>
//                         <th>Medicine Name</th>
//                         <th>Dosage</th>
//                         <th>Prescribed Qty</th>
//                         <th>Actual Qty</th>
//                         <th>Price (₹)</th>
//                         <th>Total (₹)</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {billItems.map((item, index) => (
//                         <tr key={item.id || index}>
//                           <td>
//                             <input 
//                               type="text" 
//                               className="form-control form-control-sm"
//                               value={item.medicine_name}
//                               onChange={(e) => {
//                                 const newItems = [...billItems];
//                                 newItems[index].medicine_name = e.target.value;
//                                 setBillItems(newItems);
//                               }}
//                               placeholder="Medicine name"
//                             />
//                           </td>
//                           <td>
//                             <input 
//                               type="text" 
//                               className="form-control form-control-sm"
//                               value={item.dosage}
//                               onChange={(e) => {
//                                 const newItems = [...billItems];
//                                 newItems[index].dosage = e.target.value;
//                                 setBillItems(newItems);
//                               }}
//                               placeholder="Dosage"
//                             />
//                           </td>
//                           <td>
//                             <span className="badge bg-info p-2">{item.prescribed_quantity}</span>
//                           </td>
//                           <td>
//                             <input 
//                               type="number" 
//                               className="form-control form-control-sm"
//                               value={item.actual_quantity}
//                               min="0"
//                               onChange={(e) => updateQuantity(index, e.target.value)}
//                             />
//                           </td>
//                           <td>
//                             <input 
//                               type="number" 
//                               className="form-control form-control-sm"
//                               value={item.price}
//                               min="0"
//                               step="0.01"
//                               onChange={(e) => updatePrice(index, e.target.value)}
//                             />
//                           </td>
//                           <td className="fw-bold">₹{item.total.toFixed(2)}</td>
//                           <td>
//                             <button 
//                               className="btn btn-danger btn-sm"
//                               onClick={() => removeItem(index)}
//                               title="Remove item"
//                             >
//                               ✕
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-4 border rounded">
//                   <p className="text-muted mb-3">No items added to the bill.</p>
//                   <button 
//                     className="btn btn-primary"
//                     onClick={addNewMedicine}
//                   >
//                     Add First Medicine
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Total and Actions */}
//           <div className="row mt-4">
//             <div className="col-md-8">
//               <div className="card bg-light">
//                 <div className="card-body">
//                   <h4 className="text-success mb-0">Total Amount: ₹{totalAmount.toFixed(2)}</h4>
//                   <small className="text-muted">
//                     Includes {billItems.length} medicine(s)
//                   </small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 text-end">
//               <button 
//                 className="btn btn-secondary me-2"
//                 onClick={() => navigate('/test-pharmacist')}
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="btn btn-success"
//                 onClick={handleGenerateBill}
//                 disabled={billItems.length === 0 || totalAmount === 0 || loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                     Generating...
//                   </>
//                 ) : (
//                   'Generate Bill'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillManagement;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const BillManagement = () => {
//     const [activeBilling, setActiveBilling] = useState(null);
//     const navigate = useNavigate();

//     // Sample billing data
//     const billings = {
//         1: {
//             id: "BILL-001",
//             patient: "John Smith",
//             date: "March 15, 2023",
//             items: [
//                 { name: "Lisinopril 10mg", quantity: 1, price: 85 },
//                 { name: "Atorvastatin 20mg", quantity: 1, price: 90 },
//                 { name: "Metformin 500mg", quantity: 1, price: 80 }
//             ],
//             tax: 0,
//             discount: 0,
//             total: 255,
//             status: "Pending"
//         },
//         2: {
//             id: "BILL-002",
//             patient: "Emma Johnson",
//             date: "March 14, 2023",
//             items: [
//                 { name: "Aspirin 81mg", quantity: 1, price: 60 },
//                 { name: "Metoprolol 25mg", quantity: 1, price: 100 }
//             ],
//             tax: 0,
//             discount: 0,
//             total: 160,
//             status: "Approved"
//         }
//     };

//     const loadBilling = (billingId) => {
//         setActiveBilling(billings[billingId]);
//     };

//     const processPayment = (billingId) => {
//         // Implement payment processing logic
//         alert(`Processing payment for ${billings[billingId].patient}`);
//         setActiveBilling(null);
//     };

//     return (
//         <div className="pharmacy-content">
//             <div className="content-header">
//                 <h2>Billing Management</h2>
//                 <button 
//                     className="btn btn-primary"
//                     onClick={() => navigate('pharmacist/dashboard/billmanagement')}
//                 >
//                     <i className="fas fa-arrow-left"></i> Back to Dashboard
//                 </button>
//             </div>

//             <div className="content-section">
//                 <div className="section-header">
//                     <h3 className="section-title">All Bills</h3>
//                     <button className="btn btn-success">
//                         <i className="fas fa-plus"></i> Create New Bill
//                     </button>
//                 </div>
                
//                 <div className="table-responsive">
//                     <table className="pharmacy-table">
//                         <thead>
//                             <tr>
//                                 <th>Bill ID</th>
//                                 <th>Patient</th>
//                                 <th>Date</th>
//                                 <th>Total</th>
//                                 <th>Status</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {Object.entries(billings).map(([id, billing]) => (
//                                 <tr key={id}>
//                                     <td>{billing.id}</td>
//                                     <td>{billing.patient}</td>
//                                     <td>{billing.date}</td>
//                                     <td>₹{billing.total}</td>
//                                     <td>
//                                         <span className={`status-badge ${billing.status.toLowerCase()}`}>
//                                             {billing.status}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         <div className="action-buttons">
//                                             <button 
//                                                 className="btn btn-info btn-sm"
//                                                 onClick={() => loadBilling(id)}
//                                             >
//                                                 <i className="fas fa-eye"></i> View
//                                             </button>
//                                             <button 
//                                                 className="btn btn-warning btn-sm"
//                                                 onClick={() => processPayment(id)}
//                                             >
//                                                 <i className="fas fa-credit-card"></i> Pay
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Billing Details Modal */}
//             {activeBilling && (
//                 <div className="modal-overlay active">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h3 className="modal-title">Bill Details - {activeBilling.id}</h3>
//                             <button 
//                                 className="close-btn"
//                                 onClick={() => setActiveBilling(null)}
//                             >
//                                 &times;
//                             </button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="billing-info-grid">
//                                 <div className="info-section">
//                                     <h4>Patient Information</h4>
//                                     <p><strong>Name:</strong> {activeBilling.patient}</p>
//                                     <p><strong>Date:</strong> {activeBilling.date}</p>
//                                     <p><strong>Status:</strong> 
//                                         <span className={`status-badge ${activeBilling.status.toLowerCase()}`}>
//                                             {activeBilling.status}
//                                         </span>
//                                     </p>
//                                 </div>
                                
//                                 <div className="billing-items-section">
//                                     <h4>Items</h4>
//                                     <div className="billing-items">
//                                         {activeBilling.items.map((item, index) => (
//                                             <div key={index} className="billing-item">
//                                                 <span>{item.name} (x{item.quantity})</span>
//                                                 <span>₹{item.quantity * item.price}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
                                
//                                 <div className="payment-summary">
//                                     <h4>Payment Summary</h4>
//                                     <div className="summary-item">
//                                         <span>Subtotal:</span>
//                                         <span>₹{activeBilling.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)}</span>
//                                     </div>
//                                     <div className="summary-item">
//                                         <span>Tax:</span>
//                                         <span>₹{activeBilling.tax}</span>
//                                     </div>
//                                     <div className="summary-item">
//                                         <span>Discount:</span>
//                                         <span>-₹{activeBilling.discount}</span>
//                                     </div>
//                                     <div className="summary-total">
//                                         <span>Total:</span>
//                                         <span>₹{activeBilling.total}</span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="modal-actions">
//                                 <button className="btn btn-secondary" onClick={() => setActiveBilling(null)}>
//                                     Close
//                                 </button>
//                                 <button 
//                                     className="btn btn-primary"
//                                     onClick={() => processPayment(Object.keys(billings).find(key => billings[key].id === activeBilling.id))}
//                                 >
//                                     <i className="fas fa-credit-card"></i> Process Payment
//                                 </button>
//                                 <button className="btn btn-info">
//                                     <i className="fas fa-print"></i> Print Bill
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BillManagement;

// import React, { useState } from 'react';

// const BillManagement = () => {
//     const [bills, setBills] = useState([
//         {
//             id: 1,
//             bill_number: "BILL-001",
//             patient_name: "John Smith",
//             date: "2024-01-15",
//             total_amount: 230,
//             status: "paid",
//             items: [
//                 { name: "Amoxicillin", quantity: 30, price: 150 },
//                 { name: "Ibuprofen", quantity: 20, price: 80 }
//             ]
//         },
//         {
//             id: 2,
//             bill_number: "BILL-002",
//             patient_name: "Emma Wilson",
//             date: "2024-01-14",
//             total_amount: 380,
//             status: "pending",
//             items: [
//                 { name: "Metformin", quantity: 60, price: 200 },
//                 { name: "Atorvastatin", quantity: 30, price: 180 }
//             ]
//         },
//         {
//             id: 3,
//             bill_number: "BILL-003",
//             patient_name: "Robert Brown",
//             date: "2024-01-13",
//             total_amount: 350,
//             status: "paid",
//             items: [
//                 { name: "Lisinopril", quantity: 90, price: 300 },
//                 { name: "Aspirin", quantity: 30, price: 50 }
//             ]
//         }
//     ]);

//     const [activeBill, setActiveBill] = useState(null);

//     const styles = {
//         workbench: {
//             background: 'white',
//             borderRadius: '8px',
//             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//             overflow: 'hidden',
//             margin: '20px',
//             fontFamily: 'Arial, sans-serif'
//         },
//         header: {
//             background: '#f8f9fa',
//             padding: '15px 20px',
//             borderBottom: '1px solid #dee2e6',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//         },
//         title: {
//             fontSize: '1.25rem',
//             fontWeight: '600',
//             color: '#333',
//             margin: '0'
//         },
//         gridContainer: {
//             overflowX: 'auto'
//         },
//         grid: {
//             width: '100%',
//             borderCollapse: 'collapse',
//             fontSize: '0.875rem'
//         },
//         tableHeader: {
//             background: '#e9ecef',
//             padding: '12px 8px',
//             textAlign: 'left',
//             fontWeight: '600',
//             color: '#495057',
//             borderBottom: '2px solid #dee2e6'
//         },
//         tableCell: {
//             padding: '12px 8px',
//             borderBottom: '1px solid #dee2e6',
//             color: '#333'
//         },
//         btn: {
//             padding: '4px 8px',
//             border: 'none',
//             borderRadius: '3px',
//             fontSize: '0.75rem',
//             cursor: 'pointer',
//             marginRight: '5px'
//         },
//         btnView: {
//             background: '#17a2b8',
//             color: 'white'
//         }
//     };

//     return (
//         <div style={styles.workbench}>
//             <div style={styles.header}>
//                 <h2 style={styles.title}>Billing Management</h2>
//             </div>

//             <div style={styles.gridContainer}>
//                 <table style={styles.grid}>
//                     <thead>
//                         <tr>
//                             <th style={styles.tableHeader}>Bill Number</th>
//                             <th style={styles.tableHeader}>Patient Name</th>
//                             <th style={styles.tableHeader}>Date</th>
//                             <th style={styles.tableHeader}>Total Amount</th>
//                             <th style={styles.tableHeader}>Status</th>
//                             <th style={styles.tableHeader}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {bills.map((bill) => (
//                             <tr key={bill.id}>
//                                 <td style={styles.tableCell}>{bill.bill_number}</td>
//                                 <td style={styles.tableCell}>{bill.patient_name}</td>
//                                 <td style={styles.tableCell}>{bill.date}</td>
//                                 <td style={styles.tableCell}>₹{bill.total_amount}</td>
//                                 <td style={styles.tableCell}>
//                                     <span style={{
//                                         padding: '4px 8px',
//                                         borderRadius: '12px',
//                                         fontSize: '0.75rem',
//                                         fontWeight: 'bold',
//                                         backgroundColor: bill.status === 'paid' ? '#d4edda' : '#fff3cd',
//                                         color: bill.status === 'paid' ? '#155724' : '#856404'
//                                     }}>
//                                         {bill.status}
//                                     </span>
//                                 </td>
//                                 <td style={styles.tableCell}>
//                                     <button 
//                                         style={{...styles.btn, ...styles.btnView}}
//                                         onClick={() => setActiveBill(bill)}
//                                     >
//                                         View
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Bill Detail Modal */}
//             {activeBill && (
//                 <div style={{
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     zIndex: 1000
//                 }}>
//                     <div style={{
//                         background: 'white',
//                         borderRadius: '8px',
//                         padding: '20px',
//                         width: '500px',
//                         maxWidth: '90%'
//                     }}>
//                         <h3>Bill Details - {activeBill.bill_number}</h3>
//                         <p><strong>Patient:</strong> {activeBill.patient_name}</p>
//                         <p><strong>Date:</strong> {activeBill.date}</p>
//                         <p><strong>Status:</strong> {activeBill.status}</p>
                        
//                         <h4>Items:</h4>
//                         {activeBill.items.map((item, index) => (
//                             <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                                 <span>{item.name} (x{item.quantity})</span>
//                                 <span>₹{item.quantity * item.price}</span>
//                             </div>
//                         ))}
                        
//                         <div style={{ borderTop: '2px solid #333', marginTop: '10px', paddingTop: '10px', fontWeight: 'bold' }}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                 <span>Total:</span>
//                                 <span>₹{activeBill.total_amount}</span>
//                             </div>
//                         </div>
                        
//                         <button 
//                             style={{ marginTop: '15px', padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
//                             onClick={() => setActiveBill(null)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BillManagement;