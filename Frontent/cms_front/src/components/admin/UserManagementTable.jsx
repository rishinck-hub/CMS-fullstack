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
      const data = await fetchUsers(params);
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      showNotification(err?.toString() || "Error fetching users", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(user) {
    try {
      if (editUser) {
        const payload = { ...user };
        // Only include password if provided
        if (!payload.password) delete payload.password;
        await updateUser(editUser.id, payload);
      } else {
        await addUser(user);
        // show the created password briefly to admin (entered in form)
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
    console.log(
      "UserManagementTable.openEdit",
      user && user.id,
      user && user.username
    );
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
        className="btn btn-success mb-2"
        onClick={() => {
          setEditUser(null);
          setForcePassword(false);
          setShowWizard(true);
        }}
      >
        Add User
      </button>

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
              // pass current search value so stale state doesn't send previous value
              loadUsers({ page: 1, search: v });
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
            // pass role in opts to avoid using stale state
            loadUsers({ page: 1, role: v });
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
            className={`btn btn-outline-secondary ${
              ordering === "role" ? "active" : ""
            }`}
            onClick={() => {
              const next = ordering === "role" ? "-role" : "role";
              setOrdering(next);
              loadUsers({ ordering: next });
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
                    loadUsers({ ordering: next });
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
                    loadUsers({ ordering: next });
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
                    loadUsers({ ordering: next });
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
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => {
                        openEdit(user);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => setDetailsUser(user)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        // Reset password -> open form requiring a new password
                        setEditUser(user);
                        setForcePassword(true);
                        setShowModal(true);
                      }}
                    >
                      Reset Password
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
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
                          loadUsers({ page: page - 1 });
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
                          loadUsers({ page: page + 1 });
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
            console.log("UserEditModal onClose");
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSaved={() => {
            console.log("UserEditModal onSaved");
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
