import React, { useRef, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Authcontext";
import "./FaceLogin.css";
import api from "../services/api";

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(AuthContext);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setMessage("❌ Camera access denied or not available.");
    }
  };

  const captureImage = () => {
  if (!videoRef.current) return;
  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
  canvas.toBlob((blob) => {
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    setCapturedImage(file);
    setMessage("Face captured successfully!"); 

    
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, "image/jpeg");
};
  const handleLogin = async () => {
    if (!capturedImage) {
      setMessage("⚠️ Please capture your face to continue.");
      return;
    }

    const formData = new FormData();
    formData.append("image", capturedImage);

    try {
      const res = await api.post("/face-login", formData, {
        withCredentials: true,
      });

      setMessage(res.data.message);
      if (res.data.message === "Login successful") {
        setAuthenticated(true);
        localStorage.setItem("authenticated", "true");

        
        setTimeout(() => {
          navigate("/upload");
        }, 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Face login failed.");
    }
  };

  return (
    <div className="facelogin-container">
      <h2 className="login-title">Face Login</h2>

      <div className="video-box">
        <video ref={videoRef} autoPlay width="300" height="200" />
      </div>

      <div className="button-group">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureImage}>Capture Face</button>
        <button onClick={handleLogin}>Login with Face</button>
      </div>

      {message && <p className="status-msg">{message}</p>}
    </div>
  );
};

export default FaceLogin;
