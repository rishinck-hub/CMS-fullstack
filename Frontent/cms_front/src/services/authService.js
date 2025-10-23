import api from "./api";

// Login: returns { access, refresh }
export async function login(username, password) {
  let loading = true;
  try {
    const response = await api.post("/token/", { username, password });
    return response.data;
  } catch (error) {
    // If axios response exists, include status and full data for debugging
    if (error.response) {
      const { status, data } = error.response;
      // If 401 in browser, try a raw fetch as a fallback to identify CORS or header issues
      if (status === 401) {
        try {
          const base =
            typeof import.meta !== "undefined" &&
            import.meta.env &&
            import.meta.env.VITE_API_BASE_URL
              ? import.meta.env.VITE_API_BASE_URL
              : process.env.REACT_APP_API_BASE_URL ||
                "http://localhost:8000/api";
          const raw = await fetch(base + "/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include",
          });
          const rawData = await raw.json();
          if (raw.ok) return rawData;
        } catch (fetchErr) {
          // fallback ignored, continue to throw original
        }
      }
      throw new Error(`Login failed: ${status} ${JSON.stringify(data)}`);
    }
    throw new Error(error.message || "Login failed");
  } finally {
    loading = false;
  }
}

// Refresh token: returns { access }
export async function refreshToken(refresh) {
  let loading = true;
  try {
    const response = await api.post("/token/refresh/", { refresh });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to refresh token";
  } finally {
    loading = false;
  }
}

// Optional: Password reset
export async function forgotPassword(email) {
  let loading = true;
  try {
    const response = await api.post("/auth/password-reset/", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to send reset link";
  } finally {
    loading = false;
  }
}

// Get current user profile with role-specific data
export async function getCurrentUser() {
  try {
    const response = await api.get("/admin/me/");
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to get user profile";
  }
}

// Get role-specific dashboard data
export async function getDashboardData() {
  try {
    const response = await api.get("/admin/dashboard/");
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to get dashboard data";
  }
}

// Logout is just client-side: clear localStorage, etc.
