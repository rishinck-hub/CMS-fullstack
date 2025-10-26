// import React, { useState, useEffect } from 'react';

// const ViewPrescription = () => {
//     const [prescriptionItems, setPrescriptionItems] = useState([]);
//     const [filteredItems, setFilteredItems] = useState([]);
//     const [filterText, setFilterText] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingId, setEditingId] = useState(null);
//     const [editData, setEditData] = useState({});

//     // Mock data
//     const mockData = [
//         { id: 1, quantity: 30, medicine_id: 'MED001', prescription_id: 'RX001' },
//         { id: 2, quantity: 60, medicine_id: 'MED002', prescription_id: 'RX001' },
//         { id: 3, quantity: 15, medicine_id: 'MED003', prescription_id: 'RX002' },
//         { id: 4, quantity: 90, medicine_id: 'MED004', prescription_id: 'RX003' },
//     ];

//     useEffect(() => {
//         setPrescriptionItems(mockData);
//         setFilteredItems(mockData);
//     }, []);

//     useEffect(() => {
//         const filtered = prescriptionItems.filter(item =>
//             Object.values(item).some(value =>
//                 value.toString().toLowerCase().includes(filterText.toLowerCase())
//             )
//         );
//         setFilteredItems(filtered);
//     }, [filterText, prescriptionItems]);

//     const handleEdit = (id) => {
//         if (isEditing) {
//             const itemToEdit = prescriptionItems.find(item => item.id === id);
//             setEditData({ ...itemToEdit });
//             setEditingId(id);
//         }
//     };

//     const handleSave = () => {
//         const updatedItems = prescriptionItems.map(item =>
//             item.id === editingId ? { ...editData } : item
//         );
//         setPrescriptionItems(updatedItems);
//         setEditingId(null);
//         setEditData({});
//     };

//     const handleCancel = () => {
//         setEditingId(null);
//         setEditData({});
//     };

//     const handleInputChange = (field, value) => {
//         setEditData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     // Inline CSS styles
//     const styles = {
//         workbench: {
//             background: 'white',
//             borderRadius: '8px',
//             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
//             overflow: 'hidden',
//             margin: '20px 0',
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
//         controls: {
//             display: 'flex',
//             gap: '15px',
//             alignItems: 'center'
//         },
//         filterSection: {
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px'
//         },
//         filterLabel: {
//             fontSize: '0.875rem',
//             color: '#666',
//             fontWeight: '500'
//         },
//         filterInput: {
//             padding: '6px 12px',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             fontSize: '0.875rem',
//             width: '200px'
//         },
//         editToggle: {
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             cursor: 'pointer',
//             padding: '6px 12px',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             background: 'white',
//             fontSize: '0.875rem',
//             color: '#333',
//             transition: 'all 0.2s'
//         },
//         editToggleActive: {
//             background: '#007bff',
//             color: 'white',
//             borderColor: '#007bff'
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
//             padding: '12px 16px',
//             textAlign: 'left',
//             fontWeight: '600',
//             color: '#495057',
//             borderBottom: '2px solid #dee2e6',
//             position: 'sticky',
//             top: '0'
//         },
//         tableCell: {
//             padding: '12px 16px',
//             borderBottom: '1px solid #dee2e6',
//             color: '#333'
//         },
//         columnId: {
//             width: '80px',
//             fontWeight: '600',
//             color: '#007bff'
//         },
//         columnQuantity: {
//             width: '100px',
//             textAlign: 'center'
//         },
//         columnMedicineId: {
//             width: '150px'
//         },
//         columnPrescriptionId: {
//             width: '150px'
//         },
//         tableRow: {
//             cursor: 'pointer'
//         },
//         tableRowHover: {
//             backgroundColor: '#f8f9fa'
//         },
//         editableInput: {
//             width: '100%',
//             padding: '4px 8px',
//             border: '1px solid #007bff',
//             borderRadius: '3px',
//             background: '#fff',
//             fontSize: '0.875rem'
//         },
//         actionButtons: {
//             display: 'flex',
//             gap: '8px'
//         },
//         btnSave: {
//             padding: '4px 8px',
//             border: '1px solid #28a745',
//             borderRadius: '3px',
//             background: '#28a745',
//             color: 'white',
//             fontSize: '0.75rem',
//             cursor: 'pointer'
//         },
//         btnCancel: {
//             padding: '4px 8px',
//             border: '1px solid #dc3545',
//             borderRadius: '3px',
//             background: '#dc3545',
//             color: 'white',
//             fontSize: '0.75rem',
//             cursor: 'pointer'
//         },
//         emptyState: {
//             padding: '40px 20px',
//             textAlign: 'center',
//             color: '#6c757d'
//         }
//     };

//     return (
//         <div style={styles.workbench}>
//             {/* Header Section */}
//             <div style={styles.header}>
//                 <h2 style={styles.title}>Result Grid</h2>
//                 <div style={styles.controls}>
//                     <div style={styles.filterSection}>
//                         <span style={styles.filterLabel}>Filter Rows:</span>
//                         <input
//                             type="text"
//                             style={styles.filterInput}
//                             placeholder="Search..."
//                             value={filterText}
//                             onChange={(e) => setFilterText(e.target.value)}
//                         />
//                     </div>
//                     <div 
//                         style={{
//                             ...styles.editToggle,
//                             ...(isEditing ? styles.editToggleActive : {})
//                         }}
//                         onClick={() => setIsEditing(!isEditing)}
//                     >
//                         <span>Edit:</span>
//                         <div>{isEditing ? 'ON' : 'OFF'}</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Result Grid Section */}
//             <div style={styles.gridContainer}>
//                 {filteredItems.length === 0 ? (
//                     <div style={styles.emptyState}>
//                         <p>No prescription items found</p>
//                     </div>
//                 ) : (
//                     <table style={styles.grid}>
//                         <thead>
//                             <tr>
//                                 <th style={{...styles.tableHeader, ...styles.columnId}}>id</th>
//                                 <th style={{...styles.tableHeader, ...styles.columnQuantity}}>quantity</th>
//                                 <th style={{...styles.tableHeader, ...styles.columnMedicineId}}>medicine_id</th>
//                                 <th style={{...styles.tableHeader, ...styles.columnPrescriptionId}}>prescription_id</th>
//                                 {isEditing && <th style={styles.tableHeader}>Actions</th>}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredItems.map((item, index) => (
//                                 <tr 
//                                     key={item.id} 
//                                     style={{
//                                         ...styles.tableRow,
//                                         ...(index % 2 === 0 ? {} : styles.tableRowHover)
//                                     }}
//                                     onClick={() => handleEdit(item.id)}
//                                 >
//                                     <td style={{...styles.tableCell, ...styles.columnId}}>
//                                         {editingId === item.id ? (
//                                             <input
//                                                 type="text"
//                                                 value={editData.id || ''}
//                                                 onChange={(e) => handleInputChange('id', e.target.value)}
//                                                 style={styles.editableInput}
//                                             />
//                                         ) : (
//                                             item.id
//                                         )}
//                                     </td>
//                                     <td style={{...styles.tableCell, ...styles.columnQuantity}}>
//                                         {editingId === item.id ? (
//                                             <input
//                                                 type="number"
//                                                 value={editData.quantity || ''}
//                                                 onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
//                                                 style={styles.editableInput}
//                                             />
//                                         ) : (
//                                             item.quantity
//                                         )}
//                                     </td>
//                                     <td style={{...styles.tableCell, ...styles.columnMedicineId}}>
//                                         {editingId === item.id ? (
//                                             <input
//                                                 type="text"
//                                                 value={editData.medicine_id || ''}
//                                                 onChange={(e) => handleInputChange('medicine_id', e.target.value)}
//                                                 style={styles.editableInput}
//                                             />
//                                         ) : (
//                                             item.medicine_id
//                                         )}
//                                     </td>
//                                     <td style={{...styles.tableCell, ...styles.columnPrescriptionId}}>
//                                         {editingId === item.id ? (
//                                             <input
//                                                 type="text"
//                                                 value={editData.prescription_id || ''}
//                                                 onChange={(e) => handleInputChange('prescription_id', e.target.value)}
//                                                 style={styles.editableInput}
//                                             />
//                                         ) : (
//                                             item.prescription_id
//                                         )}
//                                     </td>
//                                     {isEditing && editingId === item.id && (
//                                         <td style={styles.tableCell}>
//                                             <div style={styles.actionButtons}>
//                                                 <button style={styles.btnSave} onClick={handleSave}>
//                                                     Save
//                                                 </button>
//                                                 <button style={styles.btnCancel} onClick={handleCancel}>
//                                                     Cancel
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     )}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ViewPrescription;
// import React, { useState } from 'react';

// const ViewPrescription = () => {
//     const [prescriptions, setPrescriptions] = useState([
//         {
//             id: 1,
//             prescription_notes: "Take after meals. Avoid alcohol.",
//             date_time: "2024-01-15 10:30:00",
//             consultation_id: "CONS001",
//             doctor_id: "DOC001",
//             dosage: "10mg",
//             duration: "30 days",
//             frequency: "Once daily",
//             patient_name: "John Smith",
//             doctor_name: "Dr. Sarah Johnson",
//             status: "pending",
//             medicines: [
//                 { name: "Amoxicillin", quantity: 30, price: 150 },
//                 { name: "Ibuprofen", quantity: 20, price: 80 }
//             ]
//         },
//         {
//             id: 2,
//             prescription_notes: "Take on empty stomach. Complete full course.",
//             date_time: "2024-01-14 14:20:00",
//             consultation_id: "CONS002",
//             doctor_id: "DOC002",
//             dosage: "500mg",
//             duration: "15 days",
//             frequency: "Twice daily",
//             patient_name: "Emma Wilson",
//             doctor_name: "Dr. Michael Chen",
//             status: "approved",
//             medicines: [
//                 { name: "Metformin", quantity: 60, price: 200 },
//                 { name: "Atorvastatin", quantity: 30, price: 180 }
//             ]
//         },
//         {
//             id: 3,
//             prescription_notes: "Take with plenty of water. Monitor blood pressure.",
//             date_time: "2024-01-13 09:15:00",
//             consultation_id: "CONS003",
//             doctor_id: "DOC003",
//             dosage: "25mg",
//             duration: "90 days",
//             frequency: "Once daily",
//             patient_name: "Robert Brown",
//             doctor_name: "Dr. Emily Davis",
//             status: "dispensed",
//             medicines: [
//                 { name: "Lisinopril", quantity: 90, price: 300 },
//                 { name: "Aspirin", quantity: 30, price: 50 }
//             ]
//         }
//     ]);

//     const [filteredPrescriptions, setFilteredPrescriptions] = useState(prescriptions);
//     const [filterText, setFilterText] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingId, setEditingId] = useState(null);
//     const [editData, setEditData] = useState({});
//     const [activePrescription, setActivePrescription] = useState(null);

//     const handleFilterChange = (e) => {
//         const text = e.target.value.toLowerCase();
//         setFilterText(text);
        
//         const filtered = prescriptions.filter(prescription =>
//             prescription.patient_name.toLowerCase().includes(text) ||
//             prescription.doctor_name.toLowerCase().includes(text) ||
//             prescription.consultation_id.toLowerCase().includes(text) ||
//             prescription.prescription_notes.toLowerCase().includes(text)
//         );
//         setFilteredPrescriptions(filtered);
//     };

//     const handleEdit = (id) => {
//         if (isEditing) {
//             const prescriptionToEdit = prescriptions.find(p => p.id === id);
//             setEditData({ ...prescriptionToEdit });
//             setEditingId(id);
//         }
//     };

//     const handleSave = () => {
//         const updatedPrescriptions = prescriptions.map(prescription =>
//             prescription.id === editingId ? { ...editData } : prescription
//         );
//         setPrescriptions(updatedPrescriptions);
//         setFilteredPrescriptions(updatedPrescriptions);
//         setEditingId(null);
//         setEditData({});
//         alert('Prescription updated successfully!');
//     };

//     const handleCancel = () => {
//         setEditingId(null);
//         setEditData({});
//     };

//     const handleInputChange = (field, value) => {
//         setEditData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const approvePrescription = (id) => {
//         const updatedPrescriptions = prescriptions.map(prescription =>
//             prescription.id === id ? { ...prescription, status: 'approved' } : prescription
//         );
//         setPrescriptions(updatedPrescriptions);
//         setFilteredPrescriptions(updatedPrescriptions);
//         if (activePrescription && activePrescription.id === id) {
//             setActivePrescription(prev => ({ ...prev, status: 'approved' }));
//         }
//         alert('Prescription approved successfully!');
//     };

//     const dispensePrescription = (id) => {
//         const updatedPrescriptions = prescriptions.map(prescription =>
//             prescription.id === id ? { ...prescription, status: 'dispensed' } : prescription
//         );
//         setPrescriptions(updatedPrescriptions);
//         setFilteredPrescriptions(updatedPrescriptions);
//         if (activePrescription && activePrescription.id === id) {
//             setActivePrescription(prev => ({ ...prev, status: 'dispensed' }));
//         }
//         alert('Medicines dispensed successfully!');
//     };

//     // Inline CSS styles
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
//         controls: {
//             display: 'flex',
//             gap: '15px',
//             alignItems: 'center'
//         },
//         filterSection: {
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px'
//         },
//         filterLabel: {
//             fontSize: '0.875rem',
//             color: '#666',
//             fontWeight: '500'
//         },
//         filterInput: {
//             padding: '6px 12px',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             fontSize: '0.875rem',
//             width: '200px'
//         },
//         editToggle: {
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             cursor: 'pointer',
//             padding: '6px 12px',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             background: 'white',
//             fontSize: '0.875rem',
//             color: '#333',
//             transition: 'all 0.2s'
//         },
//         editToggleActive: {
//             background: '#007bff',
//             color: 'white',
//             borderColor: '#007bff'
//         },
//         exportButton: {
//             padding: '6px 12px',
//             border: '1px solid #28a745',
//             borderRadius: '4px',
//             background: '#28a745',
//             color: 'white',
//             fontSize: '0.875rem',
//             cursor: 'pointer'
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
//             borderBottom: '2px solid #dee2e6',
//             whiteSpace: 'nowrap'
//         },
//         tableCell: {
//             padding: '12px 8px',
//             borderBottom: '1px solid #dee2e6',
//             color: '#333',
//             maxWidth: '200px',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap'
//         },
//         tableRow: {
//             cursor: 'pointer'
//         },
//         tableRowHover: {
//             backgroundColor: '#f8f9fa'
//         },
//         statusBadge: {
//             padding: '4px 8px',
//             borderRadius: '12px',
//             fontSize: '0.75rem',
//             fontWeight: 'bold'
//         },
//         actionButtons: {
//             display: 'flex',
//             gap: '5px',
//             flexWrap: 'wrap'
//         },
//         btn: {
//             padding: '4px 8px',
//             border: 'none',
//             borderRadius: '3px',
//             fontSize: '0.75rem',
//             cursor: 'pointer',
//             transition: 'all 0.2s'
//         },
//         btnView: {
//             background: '#17a2b8',
//             color: 'white'
//         },
//         btnApprove: {
//             background: '#28a745',
//             color: 'white'
//         },
//         btnDispense: {
//             background: '#007bff',
//             color: 'white'
//         },
//         btnBill: {
//             background: '#ffc107',
//             color: '#212529'
//         },
//         modalOverlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000
//         },
//         modalContent: {
//             background: 'white',
//             borderRadius: '8px',
//             padding: '20px',
//             maxWidth: '90%',
//             maxHeight: '90%',
//             overflow: 'auto',
//             width: '800px'
//         },
//         modalHeader: {
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '20px',
//             borderBottom: '1px solid #dee2e6',
//             paddingBottom: '15px'
//         },
//         modalTitle: {
//             fontSize: '1.5rem',
//             fontWeight: '600',
//             color: '#333',
//             margin: '0'
//         },
//         closeBtn: {
//             background: 'none',
//             border: 'none',
//             fontSize: '1.5rem',
//             cursor: 'pointer',
//             color: '#666'
//         }
//     };

//     return (
//         <div style={styles.workbench}>
//             {/* Header Section */}
//             <div style={styles.header}>
//                 <h2 style={styles.title}>Result Grid</h2>
//                 <div style={styles.controls}>
//                     <div style={styles.filterSection}>
//                         <span style={styles.filterLabel}>Filter Rows:</span>
//                         <input
//                             type="text"
//                             style={styles.filterInput}
//                             placeholder="Search..."
//                             value={filterText}
//                             onChange={handleFilterChange}
//                         />
//                     </div>
//                     <div 
//                         style={{
//                             ...styles.editToggle,
//                             ...(isEditing ? styles.editToggleActive : {})
//                         }}
//                         onClick={() => setIsEditing(!isEditing)}
//                     >
//                         <span>Edit:</span>
//                         <div>{isEditing ? 'ON' : 'OFF'}</div>
//                     </div>
//                     <button style={styles.exportButton}>
//                         Export/Import:
//                     </button>
//                 </div>
//             </div>

//             {/* Result Grid Section */}
//             <div style={styles.gridContainer}>
//                 <table style={styles.grid}>
//                     <thead>
//                         <tr>
//                             <th style={styles.tableHeader}>id</th>
//                             <th style={styles.tableHeader}>prescription_notes</th>
//                             <th style={styles.tableHeader}>date_time</th>
//                             <th style={styles.tableHeader}>consultation_id</th>
//                             <th style={styles.tableHeader}>doctor_id</th>
//                             <th style={styles.tableHeader}>dosage</th>
//                             <th style={styles.tableHeader}>duration</th>
//                             <th style={styles.tableHeader}>frequency</th>
//                             <th style={styles.tableHeader}>Patient</th>
//                             <th style={styles.tableHeader}>Status</th>
//                             <th style={styles.tableHeader}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredPrescriptions.map((prescription, index) => (
//                             <tr 
//                                 key={prescription.id}
//                                 style={{
//                                     ...styles.tableRow,
//                                     ...(index % 2 === 0 ? {} : styles.tableRowHover)
//                                 }}
//                                 onClick={() => handleEdit(prescription.id)}
//                             >
//                                 <td style={styles.tableCell}>{prescription.id}</td>
//                                 <td style={styles.tableCell}>{prescription.prescription_notes}</td>
//                                 <td style={styles.tableCell}>{prescription.date_time}</td>
//                                 <td style={styles.tableCell}>{prescription.consultation_id}</td>
//                                 <td style={styles.tableCell}>{prescription.doctor_id}</td>
//                                 <td style={styles.tableCell}>{prescription.dosage}</td>
//                                 <td style={styles.tableCell}>{prescription.duration}</td>
//                                 <td style={styles.tableCell}>{prescription.frequency}</td>
//                                 <td style={styles.tableCell}>{prescription.patient_name}</td>
//                                 <td style={styles.tableCell}>
//                                     <span style={{
//                                         ...styles.statusBadge,
//                                         backgroundColor: 
//                                             prescription.status === 'approved' ? '#d4edda' : 
//                                             prescription.status === 'pending' ? '#fff3cd' : 
//                                             '#d1ecf1',
//                                         color: 
//                                             prescription.status === 'approved' ? '#155724' : 
//                                             prescription.status === 'pending' ? '#856404' : 
//                                             '#0c5460'
//                                     }}>
//                                         {prescription.status}
//                                     </span>
//                                 </td>
//                                 <td style={styles.tableCell}>
//                                     <div style={styles.actionButtons}>
//                                         <button 
//                                             style={{...styles.btn, ...styles.btnView}}
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 setActivePrescription(prescription);
//                                             }}
//                                         >
//                                             View
//                                         </button>
//                                         {prescription.status === 'pending' && (
//                                             <button 
//                                                 style={{...styles.btn, ...styles.btnApprove}}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     approvePrescription(prescription.id);
//                                                 }}
//                                             >
//                                                 Approve
//                                             </button>
//                                         )}
//                                         {prescription.status === 'approved' && (
//                                             <button 
//                                                 style={{...styles.btn, ...styles.btnDispense}}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     dispensePrescription(prescription.id);
//                                                 }}
//                                             >
//                                                 Dispense
//                                             </button>
//                                         )}
//                                         <button 
//                                             style={{...styles.btn, ...styles.btnBill}}
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 // Navigate to billing with this prescription
//                                                 alert(`Create bill for ${prescription.patient_name}`);
//                                             }}
//                                         >
//                                             Bill
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Prescription Detail Modal */}
//             {activePrescription && (
//                 <div style={styles.modalOverlay}>
//                     <div style={styles.modalContent}>
//                         <div style={styles.modalHeader}>
//                             <h3 style={styles.modalTitle}>
//                                 Prescription Details - {activePrescription.consultation_id}
//                             </h3>
//                             <button 
//                                 style={styles.closeBtn}
//                                 onClick={() => setActivePrescription(null)}
//                             >
//                                 ×
//                             </button>
//                         </div>
                        
//                         <div style={{ marginBottom: '20px' }}>
//                             <h4>Patient Information</h4>
//                             <p><strong>Name:</strong> {activePrescription.patient_name}</p>
//                             <p><strong>Doctor:</strong> {activePrescription.doctor_name}</p>
//                             <p><strong>Date:</strong> {activePrescription.date_time}</p>
//                         </div>

//                         <div style={{ marginBottom: '20px' }}>
//                             <h4>Prescription Details</h4>
//                             <p><strong>Notes:</strong> {activePrescription.prescription_notes}</p>
//                             <p><strong>Dosage:</strong> {activePrescription.dosage}</p>
//                             <p><strong>Duration:</strong> {activePrescription.duration}</p>
//                             <p><strong>Frequency:</strong> {activePrescription.frequency}</p>
//                         </div>

//                         <div style={{ marginBottom: '20px' }}>
//                             <h4>Medicines</h4>
//                             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                 <thead>
//                                     <tr>
//                                         <th style={{ border: '1px solid #ddd', padding: '8px' }}>Medicine</th>
//                                         <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
//                                         <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
//                                         <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {activePrescription.medicines.map((medicine, index) => (
//                                         <tr key={index}>
//                                             <td style={{ border: '1px solid #ddd', padding: '8px' }}>{medicine.name}</td>
//                                             <td style={{ border: '1px solid #ddd', padding: '8px' }}>{medicine.quantity}</td>
//                                             <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{medicine.price}</td>
//                                             <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{medicine.quantity * medicine.price}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
//                             <button style={styles.closeBtn} onClick={() => setActivePrescription(null)}>
//                                 Close
//                             </button>
//                             <button style={{...styles.btn, ...styles.btnBill}}>
//                                 Print Prescription
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ViewPrescription;