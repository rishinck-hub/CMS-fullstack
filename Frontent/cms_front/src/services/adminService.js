import api from "./api";

// Get all users
// Fetch users with optional server-side params: page, page_size, search, role, ordering
export const DEFAULT_PAGE_SIZE = 20;
export async function fetchUsers(params = {}) {
  let loading = true;
  try {
    const res = await api.get("/admin/users/", { params });
    
    // Support paginated DRF response { results: [], count, next, previous }
    if (res.data && Array.isArray(res.data.results)) {
      return res.data;
    }
    // Otherwise, return as simple array
    return {
      results: res.data,
      count: Array.isArray(res.data) ? res.data.length : 0,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data?.detail || "Error fetching users";
  } finally {
    loading = false;
  }
}

// Fetch a single user by id
export async function fetchUser(id) {
  try {
    const res = await api.get(`/admin/users/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || `Error fetching user ${id}`;
  }
}

// Add a new user (admin, doctor, etc.)
export async function addUser(payload) {
  let loading = true;
  try {
    // Use atomic endpoint to create user and optional profiles for consistency
    const res = await api.post("/admin/users-with-profiles/", payload);
    return res.data;
  } catch (error) {
    const data = error.response?.data;
    if (data) {
      // If DRF returns a dict of field errors, join them into a string
      if (typeof data === "object") {
        try {
          const parts = [];
          for (const k of Object.keys(data)) {
            const v = data[k];
            if (Array.isArray(v)) parts.push(`${k}: ${v.join(", ")}`);
            else parts.push(`${k}: ${String(v)}`);
          }
          throw parts.join(" | ");
        } catch (e) {
          throw String(data);
        }
      }
      throw String(data);
    }
    throw error.message || "Could not add user";
  } finally {
    loading = false;
  }
}

// Update user
export async function updateUser(id, payload) {
  let loading = true;
  try {
    const res = await api.put(`/admin/users/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update user";
  } finally {
    loading = false;
  }
}

// Delete user
export async function deleteUser(id) {
  let loading = true;
  try {
    const res = await api.delete(`/admin/users/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete user";
  } finally {
    loading = false;
  }
}

// Staffs
export async function fetchStaffs() {
  try {
    const res = await api.get("/admin/staffs/");
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching staffs";
  }
}

export async function addStaff(payload) {
  try {
    const res = await api.post("/admin/staffs/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add staff";
  }
}

export async function updateStaff(id, payload) {
  try {
    const res = await api.put(`/admin/staffs/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update staff";
  }
}

export async function deleteStaff(id) {
  try {
    const res = await api.delete(`/admin/staffs/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete staff";
  }
}

// Doctors
export async function fetchDoctors() {
  try {
    const res = await api.get("/admin/doctors/");
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching doctors";
  }
}

export async function addDoctor(payload) {
  try {
    const res = await api.post("/admin/doctors/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add doctor";
  }
}

export async function updateDoctor(id, payload) {
  try {
    const res = await api.put(`/admin/doctors/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update doctor";
  }
}

export async function deleteDoctor(id) {
  try {
    const res = await api.delete(`/admin/doctors/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete doctor";
  }
}

// Specializations
export async function fetchSpecializations() {
  try {
    const res = await api.get("/admin/specializations/");
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching specializations";
  }
}

export async function addSpecialization(payload) {
  try {
    const res = await api.post("/admin/specializations/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not add specialization";
  }
}

export async function updateSpecialization(id, payload) {
  try {
    const res = await api.put(`/admin/specializations/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update specialization";
  }
}

export async function deleteSpecialization(id) {
  try {
    const res = await api.delete(`/admin/specializations/${id}/`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not delete specialization";
  }
}

// Fetch dashboard statistics
export async function fetchDashboardStats() {
  try {
    const res = await api.get("/admin/dashboard/");
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not fetch dashboard stats";
  }
}

// Example: Fetch system reports
export async function fetchSystemReports() {
  let loading = true;
  try {
    const res = await api.get("/admin/reports/"); // Make sure this endpoint exists!
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not fetch reports";
  } finally {
    loading = false;
  }
}

// Example: Update system settings
export async function updateSettings(payload) {
  let loading = true;
  try {
    const res = await api.put("/admin/settings/", payload);
    return res.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update settings";
  } finally {
    loading = false;
  }
}

// Create user + optional profiles in one atomic request
export async function createUserWithProfiles(payload) {
  try {
    const res = await api.post("/admin/users-with-profiles/", payload);
    return res.data;
  } catch (error) {
    const data = error.response?.data;
    if (data) {
      if (typeof data === "object") {
        const parts = [];
        for (const k of Object.keys(data)) {
          const v = data[k];
          if (Array.isArray(v)) parts.push(`${k}: ${v.join(", ")}`);
          else parts.push(`${k}: ${String(v)}`);
        }
        throw parts.join(" | ");
      }
      throw String(data);
    }
    throw error.message || "Could not create user with profiles";
  }
}
