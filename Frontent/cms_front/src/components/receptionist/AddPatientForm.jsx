// import React, { useState } from "react";
// import { addPatient } from "../../services/receptionistService";

// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// export default function AddPatientForm({ onCancel, onPatientAdded }) {
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     dob: "",
//     gender: "",
//     phone: "",
//     address: "",
//     emergency_contact: "",
//     medical_history: "",
//     blood_group: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await addPatient(formData);
//       alert("Patient added successfully!");
//       onPatientAdded();
//     } catch (error) {
//       alert("Error adding patient: " + error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="card shadow-lg p-5 mx-auto my-4"
//       style={{ maxWidth: 1000, minWidth: 800, fontSize: "1.05rem" }}
//     >
//       <h3 className="text-success mb-4 text-center">Add New Patient</h3>
//       <form onSubmit={handleSubmit}>
//         {/* Name Row */}
//         <div className="row mb-4">
//           <div className="col-md-6">
//             <label className="form-label fw-bold">First Name</label>
//             <input
//               type="text"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//               placeholder="Enter first name"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <label className="form-label fw-bold">Last Name</label>
//             <input
//               type="text"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//               placeholder="Enter last name"
//               required
//             />
//           </div>
//         </div>

//         {/* DOB, Gender, Phone */}
//         <div className="row mb-4">
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Date of Birth</label>
//             <input
//               type="date"
//               name="dob"
//               value={formData.dob}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="form-select form-select-lg"
//               required
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//               placeholder="Enter phone number"
//               required
//             />
//           </div>
//         </div>

//         {/* Address & Emergency Contact */}
//         <div className="row mb-4">
//           <div className="col-md-6">
//             <label className="form-label fw-bold">Address</label>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//               rows="3"
//               placeholder="Enter address"
//               required
//             />
//           </div>
//           <div className="col-md-6">
//             <label className="form-label fw-bold">Emergency Contact</label>
//             <input
//               type="text"
//               name="emergency_contact"
//               value={formData.emergency_contact}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//               placeholder="Enter emergency contact"
//               required
//             />
//           </div>
//         </div>

//         {/* Medical History & Blood Group */}
//         <div className="row mb-4">
//           <div className="col-md-8">
//             <label className="form-label fw-bold">Medical History</label>
//             <textarea
//               name="medical_history"
//               value={formData.medical_history}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//               rows="3"
//               placeholder="Enter medical history (optional)"
//             />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Blood Group</label>
//             <select
//               name="blood_group"
//               value={formData.blood_group}
//               onChange={handleChange}
//               className="form-select form-select-lg"
//               required
//             >
//               <option value="">Select Blood Group</option>
//               {BLOOD_GROUPS.map((bg) => (
//                 <option key={bg} value={bg}>
//                   {bg}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="d-flex justify-content-end gap-3 mt-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="btn btn-secondary btn-lg"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="btn btn-success btn-lg"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save Patient"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
