import React from "react";
import { useNavigate } from "react-router-dom";
import "./AttendanceOptions.css";

export default function AttendanceOptions() {
  const navigate = useNavigate();

  return (
    <div className="login-options-container">
      <div className="login-options-box">
        <h2 className="login-title">Choose Login Method</h2>

        <button className="login-btn" onClick={() => navigate("/login")}>
          Login with Credentials
        </button>

        <button className="login-btn" onClick={() => navigate("/face-login")}>
          Login with Face
        </button>
          <p className="register-link">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
     

    </div>
    
  );
}
