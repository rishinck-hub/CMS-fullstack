import React, { useState } from "react";
import Input from "../../elements/Input";
import Button from "../../elements/Button";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { useNavigate } from "react-router-dom";
import { login as authLogin } from "../../services/authService";
import api from "../../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.debug("Login payload:", form);
      const res = await authLogin(form.username, form.password);
      console.debug("Token response:", res);
      // store tokens immediately so interceptor can attach Authorization header
      if (res?.access) localStorage.setItem("accessToken", res.access);
      if (res?.refresh) localStorage.setItem("refreshToken", res.refresh);
      console.debug("Stored accessToken:", localStorage.getItem("accessToken"));
      // fetch the user profile from backend
      const me = await api.get("/admin/me/");
      const user = me.data;
      login(user, res.access, res.refresh);
      // navigate based on role
      const rolePath = user.role ? `/${user.role.toLowerCase()}` : "/admin";
      navigate(`${rolePath}/dashboard`);
    } catch (err) {
      console.error("Login error:", err);
      // axios error
      if (err?.response) {
        setError(
          `Login failed: ${err.response.status} ${JSON.stringify(
            err.response.data
          )}`
        );
      } else {
        setError(err?.toString() || "Invalid credentials");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 80 }}>
      <h3 className="text-center mb-4">Login</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            autoFocus
            required
          />
        </div>
        <div className="mb-3">
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <Button type="submit" color="primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="mt-2 text-center">
          <a href="/auth/forgot-password">Forgot password?</a>
        </div>
      </form>
    </div>
  );
}
