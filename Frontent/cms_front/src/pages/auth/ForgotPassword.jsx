import React, { useState } from "react";
import Input from "../../elements/Input";
import Button from "../../elements/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setMessage("If this email exists, a reset link has been sent.");
      setSending(false);
    }, 1200);
    // In real use, send to your API: await api.post("/auth/password-reset/", { email })
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 80 }}>
      <h3 className="text-center mb-4">Forgot Password</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        {message && <div className="text-success mb-2">{message}</div>}
        <Button type="submit" color="primary" disabled={sending}>
          {sending ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}
