// import React, { useState } from "react";
// import api from "../../services/api"; // Update path if needed
// import { useNavigate } from "react-router-dom";

// export default function AddMedicine() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     stock: "",
//     price_per_unit: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await api.post("/pharmacist/medicines/", formData);
//       setSuccess("Medicine added successfully!");

//       setFormData({
//         name: "",
//         description: "",
//         stock: "",
//         price_per_unit: "",
//       });

//       setTimeout(() => navigate("/pharmacist/pharmacy/dashboard"), 1200);

//     } catch (err) {
//       console.error("Error adding medicine:", err);
//       setError("Failed to add medicine. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3 className="mb-3">Add Medicine</h3>

//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

//         <div className="mb-3">
//           <label className="form-label">Medicine Name</label>
//           <input
//             type="text"
//             name="name"
//             className="form-control"
//             placeholder="Enter medicine name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Description</label>
//           <textarea
//             name="description"
//             className="form-control"
//             placeholder="Enter description"
//             rows="3"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label className="form-label">Stock</label>
//             <input
//               type="number"
//               name="stock"
//               className="form-control"
//               placeholder="Enter stock"
//               value={formData.stock}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label">Price Per Unit</label>
//             <input
//               type="number"
//               name="price_per_unit"
//               className="form-control"
//               placeholder="Enter price"
//               value={formData.price_per_unit}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary w-100"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Add Medicine"}
//         </button>
//       </form>
//     </div>
//   );
// }
