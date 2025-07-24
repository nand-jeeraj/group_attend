import React from "react";
import { useNavigate } from "react-router-dom";

export default function AttendanceOptions() {
  const navigate = useNavigate();

  return (
    <div className="container form-box" style={{ textAlign: "center" }}>
      <h2>Choose Attendance Method</h2>

      <button className="btn" style={{ margin: "20px 0" }} onClick={() => navigate("/camera-attendance")}>
        📸 Capture with Camera
      </button>

      <br />

      <button className="btn" onClick={() => navigate("/")}>
        🖼️ Upload Group Photo
      </button>
    </div>
  );
}
