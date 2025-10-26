// if (loading) {
//   return <div className="p-4">Loading dashboard...</div>;
// }

// if (error) {
//   return <div className="p-4 text-danger">{error}</div>;
// }

// return (
//   <div className="container py-3">
//     <div className="d-flex justify-content-between align-items-center mb-3">
//       <h3 className="m-0">Pharmacy Dashboard</h3>
//       <button className="btn btn-secondary" onClick={loadDashboardData}>
//         Refresh
//       </button>
//     </div>

//     <div className="row g-3 mb-3">
//       <div className="col-12 col-md-6 col-lg-3">
//         <div className="card p-3">
//           <div>
//             <div className="fw-semibold small text-muted">Total Medicines</div>
//             <div className="fs-3 fw-bold">{stats.totalMedicines}</div>
//             <div className="text-muted small">Available in inventory</div>
//           </div>
//         </div>
//       </div>

//       <div className="col-12 col-md-6 col-lg-3">
//         <div className="card p-3">
//           <div>
//             <div className="fw-semibold small text-muted">Low Stock Alert</div>
//             <div className="fs-3 fw-bold text-warning">{stats.lowStockMedicines}</div>
//             <div className="text-muted small">Medicines need restocking</div>
//           </div>
//         </div>
//       </div>

//       <div className="col-12 col-md-6 col-lg-3">
//         <div className="card p-3">
//           <div>
//             <div className="fw-semibold small text-muted">Today's Billings</div>
//             <div className="fs-3 fw-bold">{stats.todayBillings}</div>
//             <div className="text-muted small">Out of {stats.totalBillings} total</div>
//           </div>
//         </div>
//       </div>

//       <div className="col-12 col-md-6 col-lg-3">
//         <div className="card p-3">
//           <div>
//             <div className="fw-semibold small text-muted">Today's Revenue</div>
//             <div className="fs-3 fw-bold">{formatCurrency(stats.todayRevenue)}</div>
//             <div className="text-muted small">Total: {formatCurrency(stats.totalRevenue)}</div>
//           </div>
//         </div>
//       </div>
//     </div>

//     <div className="row g-3">
//       <div className="col-12 col-lg-6">
//         <div className="card p-3">
//           <h5 className="mb-3">Recent Billings</h5>
//           <div className="d-flex flex-column gap-2">
//             {recentBillings.length === 0 ? (
//               <p className="text-muted text-center py-3 m-0">No recent billings</p>
//             ) : (
//               recentBillings.map((billing, idx) => (
//                 <div
//                   key={billing.id ?? idx}
//                   className="d-flex justify-content-between align-items-center p-2 border rounded"
//                 >
//                   <div>
//                     <div className="fw-semibold">Prescription #{billing.prescription ?? billing.id ?? idx}</div>
//                     <div className="small text-muted">{billing.timestamp ? formatDate(billing.timestamp) : "—"}</div>
//                   </div>
//                   <div className="text-end">
//                     <div className="fw-bold">{formatCurrency(Number(billing.total_medicine_fee) || 0)}</div>
//                     <span className="badge bg-secondary">Completed</span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="col-12 col-lg-6">
//         <div className="card p-3">
//           <h5 className="mb-3">Low Stock Items</h5>
//           <div className="d-flex flex-column gap-2">
//             {lowStockItems.length === 0 ? (
//               <p className="text-muted text-center py-3 m-0">All items well stocked</p>
//             ) : (
//               lowStockItems.map((medicine, idx) => (
//                 <div
//                   key={medicine.id ?? idx}
//                   className="d-flex justify-content-between align-items-center p-2 border rounded"
//                 >
//                   <div>
//                     <div className="fw-semibold">{medicine.name}</div>
//                     <div className="small text-muted">{medicine.description ?? ""}</div>
//                   </div>
//                   <div className="text-end">
//                     <span className="badge bg-danger">{medicine.stock} left</span>
//                     <div className="small text-muted">{formatCurrency(Number(medicine.price_per_unit) || 0)}/unit</div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>

//     <div className="card p-3 mt-3">
//       <h5 className="mb-3">Quick Actions</h5>
//       <div className="row g-2">
//         <div className="col-12 col-md-4">
//           <button className="btn btn-secondary w-100">Manage Inventory</button>
//         </div>
//         <div className="col-12 col-md-4">
//           <button className="btn btn-secondary w-100">Process Prescription</button>
//         </div>
//         <div className="col-12 col-md-4">
//           <button className="btn btn-secondary w-100">View Reports</button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// import React, { useState, useEffect } from "react";
// import { pharmacistService } from "../../services/pharmacistService";
// import Card from "../../ui/Card";
// import Badge from "../../elements/Badge";
// import Button from "../../elements/Button";

// export default function PharmacyDashboard() {
//   const [stats, setStats] = useState({
//     totalMedicines: 0,
//     lowStockMedicines: 0,
//     totalBillings: 0,
//     todayBillings: 0,
//     totalRevenue: 0,
//     todayRevenue: 0
//   });
//   const [recentBillings, setRecentBillings] = useState([]);
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       const data = await pharmacistService.getDashboardStats();
      
//       // Calculate statistics
//       const medicines = data.medicines || [];
//       const billings = data.billings || [];
//       const stockHistory = data.stockHistory || [];
      
//       // Count low stock medicines (stock < 10)
//       const lowStock = medicines.filter(med => med.stock < 10);
      
//       // Calculate today's date
//       const today = new Date().toISOString().split('T')[0];
      
//       // Filter today's billings
//       const todayBillings = billings.filter(billing => 
//         billing.timestamp && billing.timestamp.startsWith(today)
//       );
      
//       // Calculate revenue
//       const totalRevenue = billings.reduce((sum, billing) => sum + parseFloat(billing.total_medicine_fee || 0), 0);
//       const todayRevenue = todayBillings.reduce((sum, billing) => sum + parseFloat(billing.total_medicine_fee || 0), 0);
      
//       setStats({
//         totalMedicines: medicines.length,
//         lowStockMedicines: lowStock.length,
//         totalBillings: billings.length,
//         todayBillings: todayBillings.length,
//         totalRevenue,
//         todayRevenue
//       });
      
//       // Set recent billings (last 5)
//       setRecentBillings(billings.slice(0, 5));
//       setLowStockItems(lowStock.slice(0, 5));
      
//     } catch (err) {
//       setError("Failed to load dashboard data");
//       console.error("Dashboard error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   if (loading) {
//     return <div className="p-4">Loading dashboard...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-danger">{error}</div>;
//   }

//   return (
//     <div className="container py-3">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="m-0">Pharmacy Dashboard</h3>
//         <Button onClick={loadDashboardData} color="secondary">Refresh</Button>
//       </div>

//       <div className="row g-3 mb-3">
//         <div className="col-12 col-md-6 col-lg-3">
//           <Card>
//             <div>
//               <div className="fw-semibold small text-muted">Total Medicines</div>
//               <div className="fs-3 fw-bold">{stats.totalMedicines}</div>
//               <div className="text-muted small">Available in inventory</div>
//             </div>
//           </Card>
//         </div>
//         <div className="col-12 col-md-6 col-lg-3">
//           <Card>
//             <div>
//               <div className="fw-semibold small text-muted">Low Stock Alert</div>
//               <div className="fs-3 fw-bold text-warning">{stats.lowStockMedicines}</div>
//               <div className="text-muted small">Medicines need restocking</div>
//             </div>
//           </Card>
//         </div>
//         <div className="col-12 col-md-6 col-lg-3">
//           <Card>
//             <div>
//               <div className="fw-semibold small text-muted">Today's Billings</div>
//               <div className="fs-3 fw-bold">{stats.todayBillings}</div>
//               <div className="text-muted small">Out of {stats.totalBillings} total</div>
//             </div>
//           </Card>
//         </div>
//         <div className="col-12 col-md-6 col-lg-3">
//           <Card>
//             <div>
//               <div className="fw-semibold small text-muted">Today's Revenue</div>
//               <div className="fs-3 fw-bold">{formatCurrency(stats.todayRevenue)}</div>
//               <div className="text-muted small">Total: {formatCurrency(stats.totalRevenue)}</div>
//             </div>
//           </Card>
//         </div>
//       </div>

//       <div className="row g-3">
//         <div className="col-12 col-lg-6">
//           <Card>
//             <h5 className="mb-3">Recent Billings</h5>
//             <div className="d-flex flex-column gap-2">
//               {recentBillings.length === 0 ? (
//                 <p className="text-muted text-center py-3 m-0">No recent billings</p>
//               ) : (
//                 recentBillings.map((billing) => (
//                   <div key={billing.id} className="d-flex justify-content-between align-items-center p-2 border rounded">
//                     <div>
//                       <div className="fw-semibold">Prescription #{billing.prescription}</div>
//                       <div className="small text-muted">{formatDate(billing.timestamp)}</div>
//                     </div>
//                     <div className="text-end">
//                       <div className="fw-bold">{formatCurrency(billing.total_medicine_fee)}</div>
//                       <Badge color="secondary">Completed</Badge>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </Card>
//         </div>

//         <div className="col-12 col-lg-6">
//           <Card>
//             <h5 className="mb-3">Low Stock Items</h5>
//             <div className="d-flex flex-column gap-2">
//               {lowStockItems.length === 0 ? (
//                 <p className="text-muted text-center py-3 m-0">All items well stocked</p>
//               ) : (
//                 lowStockItems.map((medicine) => (
//                   <div key={medicine.id} className="d-flex justify-content-between align-items-center p-2 border rounded">
//                     <div>
//                       <div className="fw-semibold">{medicine.name}</div>
//                       <div className="small text-muted">{medicine.description}</div>
//                     </div>
//                     <div className="text-end">
//                       <Badge color="danger">{medicine.stock} left</Badge>
//                       <div className="small text-muted">{formatCurrency(medicine.price_per_unit)}/unit</div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </Card>
//         </div>
//       </div>

//       <Card>
//         <h5 className="mb-3">Quick Actions</h5>
//         <div className="row g-2">
//           <div className="col-12 col-md-4"><Button color="secondary" className="w-100">Manage Inventory</Button></div>
//           <div className="col-12 col-md-4"><Button color="secondary" className="w-100">Process Prescription</Button></div>
//           <div className="col-12 col-md-4"><Button color="secondary" className="w-100">View Reports</Button></div>
//         </div>
//       </Card>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { pharmacistService } from "../../services/pharmacistService"; // optional — you can disable for now

// const PharmacyDashboard = () => {
//   const [stats, setStats] = useState({
//     totalMedicines: 0,
//     lowStockMedicines: 0,
//     totalBillings: 0,
//     todayBillings: 0,
//     totalRevenue: 0,
//     todayRevenue: 0,
//   });

//   const [recentBillings, setRecentBillings] = useState([]);
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await pharmacistService.getDashboardStats();
//       const data = response.data;

//       setStats(data.stats);
//       setRecentBillings(data.recentBillings || []);
//       setLowStockItems(data.lowStockItems || []);
//     } catch (err) {
//       console.error("Error loading dashboard:", err);
//       setError("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   if (loading) return <div className="text-center mt-5">Loading...</div>;
//   if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4 text-center">💊 Pharmacist Dashboard</h2>

//       {/* Stats Cards */}
//       <div className="row g-3 mb-4">
//         <div className="col-md-4">
//           <div className="card text-center shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Total Medicines</h5>
//               <h3 className="text-primary">{stats.totalMedicines}</h3>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-4">
//           <div className="card text-center shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Low Stock Medicines</h5>
//               <h3 className="text-danger">{stats.lowStockMedicines}</h3>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-4">
//           <div className="card text-center shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Total Billings</h5>
//               <h3 className="text-success">{stats.totalBillings}</h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Revenue Section */}
//       <div className="row g-3 mb-4">
//         <div className="col-md-6">
//           <div className="card text-center border-success shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Total Revenue</h5>
//               <h3 className="text-success">₹ {stats.totalRevenue}</h3>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-6">
//           <div className="card text-center border-info shadow-sm">
//             <div className="card-body">
//               <h5 className="card-title">Today's Revenue</h5>
//               <h3 className="text-info">₹ {stats.todayRevenue}</h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Low Stock Table */}
//       <div className="card mb-4 shadow-sm">
//         <div className="card-header bg-danger text-white">Low Stock Medicines</div>
//         <div className="card-body p-0">
//           <table className="table table-striped table-hover mb-0">
//             <thead className="table-danger">
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Stock</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lowStockItems.length > 0 ? (
//                 lowStockItems.map((med) => (
//                   <tr key={med.id}>
//                     <td>{med.id}</td>
//                     <td>{med.name}</td>
//                     <td>{med.stock}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center text-muted">
//                     No low stock medicines 🎉
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Recent Billings Table */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-primary text-white">Recent Billings</div>
//         <div className="card-body p-0">
//           <table className="table table-striped table-hover mb-0">
//             <thead className="table-primary">
//               <tr>
//                 <th>ID</th>
//                 <th>Prescription</th>
//                 <th>Date</th>
//                 <th>Total Fee</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentBillings.map((bill) => (
//                 <tr key={bill.id}>
//                   <td>{bill.id}</td>
//                   <td>{bill.prescription}</td>
//                   <td>{new Date(bill.timestamp).toLocaleString()}</td>
//                   <td>₹ {bill.total_medicine_fee}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PharmacyDashboard;
