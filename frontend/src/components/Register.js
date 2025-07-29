// // import React, { useState } from "react";
// import api from "../services/api";
// import { useNavigate, Link } from "react-router-dom";
// import "./Login.css";

// export default function Register() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();

//   const validateEmail = (email) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validatePassword = (password) =>
//     password.length >= 6;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(form.username)) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     if (!validatePassword(form.password)) {
//       alert("Password must be at least 6 characters long.");
//       return;
//     }

//     if (!image) {
//       alert("Please upload your face image.");
//       return;
//     }

//     const data = new FormData();
//     data.append("username", form.username);
//     data.append("password", form.password);
//     data.append("image", image);

//     try {
//       await api.post("/register", data);
//       alert("Registration successful!");
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.error || err.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="login-page">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h2 className="login-title">Create Account</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="login-input"
//           value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="login-input"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           required
//         />

//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImage(e.target.files[0])}
//           className="login-input"
//           required
//         />

//         <small style={{ color: "gray", marginBottom: "10px" }}>
//           Password must be at least 6 characters.
//         </small>

//         <button className="login-button" type="submit">
//           Register
//         </button>

//         <p className="register-link">
//           Already have an account? <Link to="/login-options">Login here</Link>
//         </p>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !image) {
      alert("All fields are required including image.");
      return;
    }

    if (!validateEmail(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(form.password)) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("image", image);

    try {
      await api.post("/register", data);
      alert("Registration successful!");
      navigate("/login-options");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="login-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="login-input"
          required
        />

        <small style={{ color: "gray", marginBottom: "10px" }}>
          Password must be at least 6 characters.
        </small>

        <button className="login-button" type="submit">
          Register
        </button>

        <p className="register-link">
          Already have an account? <Link to="/login-options">Login here</Link>
        </p>
      </form>
    </div>
  );
}

