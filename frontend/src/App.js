import React, { useContext } from "react";
import "./style.css";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import api from "./services/api";
import { AuthContext } from "./Authcontext";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated } = useContext(AuthContext);

  
  const hiddenRoutes = ["/login", "/register", "/face-login", "/login-options"];
  const shouldHideNavbar = hiddenRoutes.includes(location.pathname);

  const logout = async () => {
    try {
      await api.post("/logout");
      setAuthenticated(false);
      navigate("/login-options");
    } catch (err) {
      alert("Logout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-200 p-4">
      {!shouldHideNavbar && (
        <nav className="flex gap-4 mb-6 items-center">
          <Link to="/upload">Upload</Link>
          
          <Link to="/upload/history">History</Link>
          <Link to="/upload/dashboard">Dashboard</Link>
          <Link to="/upload/add-face">Add Face</Link>

          <button
            onClick={logout}
            style={{
              backgroundColor: "#e53e3e",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      )}
      <Outlet />
    </div>
  );
}
