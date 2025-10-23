import React, { useState } from "react";
import Input from "../../elements/Input";
import Button from "../../elements/Button";
import useAuth from "../../hooks/useAuth"; // Corrected import
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
      // Authenticate
      const res = await authLogin(form.username, form.password);
      if (res?.access) localStorage.setItem("accessToken", res.access);
      if (res?.refresh) localStorage.setItem("refreshToken", res.refresh);

      // Fetch user profile
      const me = await api.get("/admin/me/");
      const user = me.data;

      login(user, res.access, res.refresh);

      navigate("/dashboard");
    } catch (err) {
      if (err?.response) {
        setError(
          `Login failed: ${err.response.status} ${JSON.stringify(err.response.data)}`
        );
      } else {
        setError(err?.toString() || "Invalid credentials");
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-page-bg">
      <div className="container login-container">
        <h3 className="text-center mb-4 text-white fw-bold">Sign In to ClinicMS</h3>
        <form onSubmit={handleSubmit} className="login-card card p-4 border-0 shadow-lg">
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
          <Button type="submit" color="primary" disabled={loading} className="w-100 mb-2">
            {loading ? "Logging in..." : "Login"}
          </Button>
          {/* <div className="mt-2 text-center">
            <a href="/auth/forgot-password" className="link-primary text-decoration-none">
              Forgot password?
            </a>
          </div> */}
        </form>
      </div>
      <style>{`
        .login-page-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-container {
          max-width: 410px;
          width: 100%;
          margin: 0 auto;
        }
        .login-card {
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(102,126,234,0.18);
          background: #fff;
          transition: box-shadow 0.3s;
        }
        .login-card:hover {
          box-shadow: 0 16px 40px rgba(118,75,162,0.18);
        }
        .login-card .btn {
          border-radius: 8px;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .login-card .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        .login-card .btn-primary:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          box-shadow: 0 4px 16px rgba(102,126,234,0.18);
        }
      `}</style>
    </div>
  );
}
