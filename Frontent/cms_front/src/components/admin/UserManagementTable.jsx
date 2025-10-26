import React, { useEffect, useState, useContext, useRef } from "react";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../services/adminService";
import UserEditModal from "./UserEditModal";
import AdminForm from "./AdminForm";
import UserWizard from "./UserWizard";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { NotificationContext } from "../../context/NotificationContext";
import UserDetailsModal from "./UserDetailsModal";
import StaffForm from "./StaffForm";
import DoctorForm from "./DoctorForm";
import { IoIosPersonAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import { MdOutlinePreview } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

export default function UserManagementTable({ onDataChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [ordering, setOrdering] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const searchRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { showNotification } = useContext(NotificationContext);
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [forcePassword, setForcePassword] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [initialStaff, setInitialStaff] = useState(null);
  const [initialDoctor, setInitialDoctor] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers(opts = {}) {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        search: search || undefined,
        role: roleFilter || undefined,
        ordering: ordering || undefined,
        ...opts,
      };

      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const data = await fetchUsers(params);
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error('Error loading users:', err);
      showNotification(err?.toString() || "Error fetching users", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(user) {
    try {
      if (editUser) {
        const payload = { ...user };
        if (!payload.password) delete payload.password;
        await updateUser(editUser.id, payload);
      } else {
        await addUser(user);
        if (user.password)
          showNotification(
            `Password for ${user.username}: ${user.password}`,
            "info"
          );
      }
      setShowModal(false);
      setEditUser(null);
      setForcePassword(false);
      await loadUsers();
      onDataChange && onDataChange();
      showNotification("User saved", "success");
    } catch (error) {
      showNotification(error?.toString() || "Error saving user", "danger");
    }
  }

  function openEdit(user) {
    setSelectedUser(user);
    setShowEditModal(true);
  }

  async function handleDelete(id) {
    setConfirm({ show: true, id });
  }

  return (
    <div>
      <h4 className="mb-3">User Management</h4>
      <button
        className="add-user-btn mb-2"
        onClick={() => {
          setEditUser(null);
          setForcePassword(false);
          setShowWizard(true);
        }}
      >
        <IoIosPersonAdd style={{ marginBottom: "3px", marginRight: "6px" }}/> Add User
      </button>
      <style>
        {`
          .add-user-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border: none;
            font-weight: 600;
            border-radius: 8px;
            padding: 8px 18px;
            font-size: 1.1rem;
            box-shadow: 0 4px 12px rgba(102,126,234,0.11);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: background 0.2s, transform 0.18s;
          }
          .add-user-btn:hover, .add-user-btn:focus {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            color: #2ca9edff;
            transform: translateY(-1.5px) scale(1.03);
          }
          .cus-user-btn {
            background: linear-gradient(135deg, #009ef3ff 0%, #0091ffff 100%);
            color: #fff;
            border: none;
            margin:2px;
            font-weight: 400;
            border-radius: 8px;
            padding: 4px 18px;
            font-size: 1rem;
            box-shadow: 0 4px 12px rgba(102,126,234,0.11);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: background 0.2s, transform 0.18s;
          }
          .cus-user-btn:hover, .add-user-btn:focus {
            background: linear-gradient(135deg, #0858ecff 0%, #3054f4ff 100%);
            color: #ffffffff;
            transform: translateY(-1.5px) scale(1.03);
          }
          .cu-user-btn {
            background: linear-gradient(135deg, #e14343ff 0%, #e53d3dff 100%);
            color: #fff;
            border: none;
            margin:2px;
            font-weight: 400;
            border-radius: 8px;
            padding: 4px 18px;
            font-size: 1rem;
            box-shadow: 0 4px 12px rgba(102,126,234,0.11);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: background 0.2s, transform 0.18s;
          }
          .cu-user-btn:hover, .add-user-btn:focus {
            background: linear-gradient(135deg, #ec0808ff 0%, #f43030ff 100%);
            color: #ffffffff;
            transform: translateY(-1.5px) scale(1.03);
          }
        `}
      </style>

      {/* Filters / Search UI */}
      <div className="d-flex gap-2 align-items-center mt-2">
        <input
          placeholder="Search username or email..."
          className="form-control w-50"
          value={search}
          onChange={(e) => {
            const v = e.target.value;
            setSearch(v);
            if (searchRef.current) clearTimeout(searchRef.current);
            searchRef.current = setTimeout(() => {
              setPage(1);
              loadUsers({ page: 1, search: v, role: roleFilter, ordering: ordering });
            }, 400);
          }}
        />
        <select
          className="form-select w-25"
          value={roleFilter}
          onChange={(e) => {
            const v = e.target.value;
            setRoleFilter(v);
            setPage(1);
            loadUsers({ page: 1, role: v, search: search, ordering: ordering });
          }}
        >
          <option value="">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Doctor">Doctor</option>
          <option value="Pharmacist">Pharmacist</option>
        </select>
        <div className="btn-group">
          <button
            className={`btn btn-outline-secondary ${ordering === "role" ? "active" : ""}`}
            onClick={() => {
              const next = ordering === "role" ? "-role" : "role";
              setOrdering(next);
              loadUsers({ ordering: next, search: search, role: roleFilter, page: 1 });
            }}
            title="Sort by role"
          >
            Role
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th
                  role="button"
                  onClick={() => {
                    const next =
                      ordering === "username" ? "-username" : "username";
                    setOrdering(next);
                    loadUsers({ ordering: next, search: search, role: roleFilter, page: 1 });
                  }}
                >
                  Username{" "}
                  {ordering.includes("username")
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th
                  role="button"
                  onClick={() => {
                    const next = ordering === "role" ? "-role" : "role";
                    setOrdering(next);
                    loadUsers({ ordering: next, search: search, role: roleFilter, page: 1 });
                  }}
                >
                  Role{" "}
                  {ordering.includes("role")
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th
                  role="button"
                  onClick={() => {
                    const next =
                      ordering === "is_active" ? "-is_active" : "is_active";
                    setOrdering(next);
                    loadUsers({ ordering: next, search: search, role: roleFilter, page: 1 });
                  }}
                >
                  Status{" "}
                  {ordering.includes("is_active")
                    ? ordering.startsWith("-")
                      ? "↓"
                      : "↑"
                    : ""}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id}>
                  <td>{(page - 1) * pageSize + idx + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        user.is_active ? "success" : "danger"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="cus-user-btn mb-2"
                      onClick={() => {
                        openEdit(user);
                      }}
                    >
                     <FaEdit /> Edit
                    </button>
                    <button
                      className="cus-user-btn mb-2"
                      onClick={() => setDetailsUser(user)}
                    >
                      <MdOutlinePreview />View
                    </button>
                    <button
                      className="cus-user-btn mb-2"
                      onClick={() => {
                        setEditUser(user);
                        setForcePassword(true);
                        setShowModal(true);
                      }}
                    >
                      <MdLockReset />Reset Password
                    </button>
                    <button
                      className="cu-user-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      <MdDeleteForever />Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              Showing {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, totalCount)} of {totalCount}
            </div>
            <div>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => {
                        if (page > 1) {
                          setPage(page - 1);
                          loadUsers({ page: page - 1, search: search, role: roleFilter, ordering: ordering });
                        }
                      }}
                    >
                      Prev
                    </button>
                  </li>
                  <li
                    className={`page-item ${
                      page * pageSize >= totalCount ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        if (page * pageSize < totalCount) {
                          setPage(page + 1);
                          loadUsers({ page: page + 1, search: search, role: roleFilter, ordering: ordering });
                        }
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Modals and forms (unchanged) */}
      <AdminForm
        show={showModal}
        mode="user"
        initial={editUser}
        forcePassword={forcePassword}
        onClose={() => {
          setShowModal(false);
          setForcePassword(false);
          setEditUser(null);
        }}
        onSave={handleSave}
      />

      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSaved={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            loadUsers();
            onDataChange && onDataChange();
          }}
        />
      )}

      <UserWizard
        show={showWizard}
        onClose={() => setShowWizard(false)}
        onCreated={async () => {
          setShowWizard(false);
          await loadUsers();
          onDataChange && onDataChange();
        }}
      />

      <ConfirmDialog
        show={confirm.show}
        title="Delete user"
        message="Delete this user?"
        onCancel={() => setConfirm({ show: false, id: null })}
        onConfirm={async () => {
          try {
            await deleteUser(confirm.id);
            setConfirm({ show: false, id: null });
            await loadUsers();
            onDataChange && onDataChange();
            showNotification("Deleted", "success");
          } catch (err) {
            showNotification(err?.toString() || "Delete failed", "danger");
          }
        }}
      />

      <UserDetailsModal
        user={detailsUser}
        show={!!detailsUser}
        onClose={() => setDetailsUser(null)}
        onEditUser={(u) => {
          setEditUser(u);
          setShowModal(true);
          setDetailsUser(null);
        }}
        onEditStaff={(s) => {
          setInitialStaff(s);
          setShowStaffForm(true);
          setDetailsUser(null);
        }}
        onEditDoctor={(d) => {
          setInitialDoctor(d);
          setShowDoctorForm(true);
          setDetailsUser(null);
        }}
      />

      <StaffForm
        show={showStaffForm}
        initial={initialStaff}
        onClose={() => {
          setShowStaffForm(false);
          setInitialStaff(null);
        }}
        onSaved={async () => {
          setShowStaffForm(false);
          setInitialStaff(null);
          await loadUsers();
          onDataChange && onDataChange();
        }}
      />

      <DoctorForm
        show={showDoctorForm}
        initial={initialDoctor}
        onClose={() => {
          setShowDoctorForm(false);
          setInitialDoctor(null);
        }}
        onSaved={async () => {
          setShowDoctorForm(false);
          setInitialDoctor(null);
          await loadUsers();
          onDataChange && onDataChange();
        }}
      />
    </div>
  );
}
