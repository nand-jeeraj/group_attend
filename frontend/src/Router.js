import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import FaceLogin from "./components/FaceLogin";
import AttendanceOptions from "./components/AttendanceOptions"; // this is login-options
import Register from "./components/Register";
import UploadPage from "./components/UploadPage";
import History from "./components/History";
import Dashboard from "./components/Dashboard";
import AddFace from "./components/AddFace";
import api from "./services/api";
import { AuthContext } from "./Authcontext";

export default function Router() {
  const [authenticated, setAuthenticated] = useState(null);

  const checkAuth = () => {
    api.get("/check-auth")
      .then(() => {
        setAuthenticated(true);
        localStorage.setItem("authenticated", "true");
      })
      .catch(() => {
        setAuthenticated(false);
        localStorage.removeItem("authenticated");
      });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (authenticated === null) return <div>Loading…</div>;

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, checkAuth }}>
      <Routes>
        {/* Default route shows login-options page */}
        <Route path="/" element={<AttendanceOptions />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/upload" /> : <Login />}
        />
        <Route
          path="/face-login"
          element={authenticated ? <Navigate to="/upload" /> : <FaceLogin />}
        />
        <Route
          path="/login-options"
          element={authenticated ? <Navigate to="/upload" /> : <AttendanceOptions />}
        />
        <Route
          path="/register"
          element={authenticated ? <Navigate to="/upload" /> : <Register />}
        />

        {/* Protected Routes */}
        {authenticated && (
          <Route path="/upload" element={<App />}>
            <Route index element={<UploadPage />} />
            <Route path="history" element={<History />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-face" element={<AddFace />} />
          </Route>
        )}
      </Routes>
    </AuthContext.Provider>
  );
}
