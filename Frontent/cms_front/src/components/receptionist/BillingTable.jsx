/*  BillingTable.jsx  –  FULL REPLACEMENT (theme-aware + live appointment list)  */
import React, { useEffect, useState } from "react";
import { BsReceipt, BsHourglass, BsClipboardData } from "react-icons/bs";
import {
  fetchBills,
  addBill,
  updateBill,
  deleteBill,
  fetchAppointments   // ← 1.  IMPORT
} from "../../services/receptionistService";

export default function BillingTable({ appointments = [], patients = [] }) {
  /* ---------- state ---------- */
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [todayCount, setTodayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  /*  NEW  –  full appointment list for drop-down  */
  const [apptList, setApptList] = useState([]);

  const blank = () => ({
    appointment_id: "",
    consultation_fee: "",
    medicine_fee: "",
    total_fee: 0,
    is_paid: false,
    timestamp: new Date().toISOString().slice(0, 16),
  });
  const [form, setForm] = useState(blank());

  /* ---------- life-cycle ---------- */
  const load = async () => {
    try {
      const data = await fetchBills();
      const list = Array.isArray(data) ? data : data.results || [];
      setBills(list);

      const today = new Date().toDateString();
      setTodayCount(list.filter(b => new Date(b.timestamp).toDateString() === today).length);
      setPendingCount(list.filter(b => !b.is_paid).length);
      setTotalCount(list.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  /*  NEW  –  fetch every appointment once  */
  useEffect(() => {
    fetchAppointments()
      .then(setApptList)
      .catch(console.error);
  }, []);

  /* ---------- helpers ---------- */
  const patientOf = (apptId) => {
    const appt = appointments.find((a) => a.id === apptId) || apptList.find(a => a.id === apptId);
    if (!appt) return {};
    return patients.find((p) => p.id === appt.patient_id) || {};
  };

  /* auto total */
  useEffect(() => {
    const c = Number(form.consultation_fee) || 0;
    const m = Number(form.medicine_fee) || 0;
    setForm((f) => ({ ...f, total_fee: (c + m).toFixed(2) }));
  }, [form.consultation_fee, form.medicine_fee]);

  /* ---------- CRUD ---------- */
  const handleSubmit = async () => {
    try {
      if (editing) await updateBill(editing.id, form);
      else await addBill(form);
      setShowForm(false);
      setEditing(null);
      setForm(blank());
      load();
    } catch (e) {
      alert(e.message || "Save failed");
    }
  };

  const handleEdit = (bill) => {
    setForm({ ...bill, timestamp: bill.timestamp.slice(0, 16) });
    setEditing(bill);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill ?")) return;
    try {
      await deleteBill(id);
      load();
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handlePrint = (bill) => {
    const win = window.open("", "bill", "width=400,height=600");
    win.document.write(printTemplate(bill, patientOf(bill.appointment_id)));
    win.document.close();
    win.focus();
    win.print();
    win.onafterprint = async () => {
      if (!bill.is_paid) {
        await updateBill(bill.id, { ...bill, is_paid: true });
        load();
      }
      win.close();
    };
  };

  /* ---------- search ---------- */
  const filtered = bills.filter((b) => {
    const p = patientOf(b.appointment_id);
    const str = search.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(str) ||
      p.last_name?.toLowerCase().includes(str) ||
      p.phone?.includes(str) ||
      b.id.toString().includes(str) ||
      b.appointment_id.toString().includes(str)
    );
  });

  /* ---------- empty ---------- */
  if (!bills.length)
    return (
      <div className="text-center mt-5 text-muted">
        <h5>No bills yet</h5>
        <button className="btn btn-sidebar mt-3" onClick={() => setShowForm(true)}>
          + Create first bill
        </button>
      </div>
    );

  /* -------------------------------------------------------- */
  return (
    <>
      <div className="billing-bg" />
      <div className="container-fluid px-4 py-3 billing-content">
        {/* stats */}
        <div className="row mb-4 g-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="stat-icon me-3" style={{ backgroundColor: '#e3ebfc', color: '#1cc88a' }}>
                  <BsReceipt size={24} />
                </div>
                <div>
                  <div className="text-muted small">Today's Bills</div>
                  <div className="fs-5 fw-bold" style={{ color: '#1cc88a' }}>{todayCount}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="stat-icon me-3" style={{ backgroundColor: '#fef7e6', color: '#f6c23e' }}>
                  <BsHourglass size={24} />
                </div>
                <div>
                  <div className="text-muted small">Pending Bills</div>
                  <div className="fs-5 fw-bold" style={{ color: '#f6c23e' }}>{pendingCount}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="stat-icon me-3" style={{ backgroundColor: '#d1f3e8', color: '#4e73df' }}>
                  <BsClipboardData size={24} />
                </div>
                <div>
                  <div className="text-muted small">Total Bills</div>
                  <div className="fs-5 fw-bold" style={{ color: '#4e73df' }}>{totalCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* toolbar */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search patient / phone / bill #"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col text-end">
            <button
              className="btn btn-sidebar"
              onClick={() => {
                setForm(blank());
                setEditing(null);
                setShowForm(true);
              }}
            >
              + Add New Bill
            </button>
          </div>
        </div>

        {/* form modal */}
        {showForm && (
          <div className="modal d-block" style={{ background: "rgba(0,0,0,.4)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>{editing ? "Edit Bill" : "New Bill"}</h5>
                  <button className="btn-close" onClick={() => setShowForm(false)} />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Appointment *</label>
                      {/*  NEW  –  live appointment list  */}
                      <select
                        className="form-select"
                        value={form.appointment_id}
                        onChange={(e) => setForm({ ...form, appointment_id: e.target.value })}
                        disabled={!!editing}
                      >
                        <option value="">Select appointment</option>
                        {apptList.map((a) => (
                          <option key={a.id} value={a.id}>
                            #{a.id} – {a.patient?.first_name} {a.patient?.last_name} &nbsp;
                            ({new Date(a.date_time).toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label>Consultation ₹</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.consultation_fee}
                        onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Medicine ₹</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.medicine_fee}
                        onChange={(e) => setForm({ ...form, medicine_fee: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Total ₹</label>
                      <input
                        type="text"
                        className="form-control fw-bold"
                        value={`₹${Number(form.total_fee).toFixed(2)}`}
                        disabled
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Date-time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={form.timestamp}
                        onChange={(e) => setForm({ ...form, timestamp: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={form.is_paid}
                          onChange={(e) => setForm({ ...form, is_paid: e.target.checked })}
                        />
                        <label className="form-check-label">Paid immediately</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button className="btn btn-sidebar" onClick={handleSubmit}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* table */}
        <div className="card shadow-sm">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Consultation</th>
                <th>Medicine</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ width: "220px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const p = patientOf(b.appointment_id);
                return (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td className="fw-500">{p.first_name} {p.last_name}</td>
                    <td>{p.phone}</td>
                    <td>{new Date(b.timestamp).toLocaleDateString()}</td>
                    <td>₹{Number(b.consultation_fee).toFixed(2)}</td>
                    <td>₹{Number(b.medicine_fee).toFixed(2)}</td>
                    <td className="fw-bold">₹{Number(b.total_fee).toFixed(2)}</td>
                    <td>
                      {b.is_paid ? (
                        <span className="badge bg-success">Paid</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handlePrint(b)}>
                        Print
                      </button>
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleEdit(b)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="text-center py-4 text-muted">No bills match your search</div>
          )}
        </div>
      </div>

      {/* ----------  THEME + BUTTON STYLES  ---------- */}
      <style>{`
        /* 1. full-page gradient background */
        .billing-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(135deg, #727da9ff 0%, #8a6ca9ff 100%);
        }
        .billing-content {
          position: relative;
          z-index: 1;
        }
        .btn-sidebar {
          background: linear-gradient(135deg, #727da9ff 0%, #8a6ca9ff 100%);
          color: #fff;
          border: none;
          font-weight: 500;
          transition: 0.3s;
        }
        .btn-sidebar:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .btn-outline-primary,
        .btn-outline-secondary,
        .btn-outline-danger {
          border-width: 1.5px;
        }
      `}</style>
    </>
  );
}

/* ---------- small components ---------- */
function StatCard({ title, value, icon, color }) {
  return (
    <div className="col-md-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body d-flex align-items-center">
          <div className="fs-2 me-3">{icon}</div>
          <div>
            <div className="text-muted small">{title}</div>
            <div className="fs-5 fw-bold" style={{ color }}>
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- very small bill template ---------- */
function printTemplate(bill, patient) {
  return `
    <html>
      <head>
        <title>Bill #${bill.id}</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;font-size:14px;margin:0;padding:20px}
          .center{text-align:center}
          .right{text-align:right}
          .bold{font-weight:700}
          .mb-1{margin-bottom:4px}
          .mb-2{margin-bottom:8px}
          .w-100{width:100%}
          table{border-collapse:collapse;margin-top:10px}
          th,td{padding:6px 10px;border:1px solid #ccc}
          th{background:#f2f2f2}
        </style>
      </head>
      <body>
        <div className="center mb-2"><h3>ClinicMS</h3></div>
        <div className="center text-muted mb-2">Bill Receipt</div>

        <div className="mb-2">
          <div><strong>Bill #</strong>${bill.id}</div>
          <div><strong>Patient</strong>${patient.first_name} ${patient.last_name}</div>
          <div><strong>Phone</strong>${patient.phone || "—"}</div>
          <div><strong>Date</strong>${new Date(bill.timestamp).toLocaleString()}</div>
        </div>

        <table className="w-100">
          <thead><tr><th>Particular</th><th className="right">Amount (₹)</th></tr></thead>
          <tbody>
            <tr><td>Consultation</td><td className="right">${Number(bill.consultation_fee).toFixed(2)}</td></tr>
            <tr><td>Medicine</td><td className="right">${Number(bill.medicine_fee).toFixed(2)}</td></tr>
            <tr className="bold"><td>Total</td><td className="right">${Number(bill.total_fee).toFixed(2)}</td></tr>
          </tbody>
        </table>

        <div className="center mt-3 text-muted">Thank you. Get well soon!</div>
      </body>
    </html>`;
}