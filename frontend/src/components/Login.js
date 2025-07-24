import React, { useState, useContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authcontext";
import "./Login.css"; 

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      if (res.data.success) {
        setAuthenticated(true);
        // navigate("/attendance-options");
        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>

        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="login-button" type="submit">
          Sign In
        </button>

        <p className="register-link">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
        
      </form>
    </div>
  );
}
