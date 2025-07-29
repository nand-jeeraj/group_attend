import React, { useState } from "react";
import api from "../services/api";
import "./UploadPage.css";

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    const fd = new FormData();
    fd.append("image", image);

    setLoading(true);
    setResult(null); 

    try {
      const res = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2 className="upload-title">Upload Group Photo</h2>

        <input
          type="file"
          className="upload-input"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          disabled={loading}
        />

        <button className="upload-button" onClick={submit} disabled={loading}>
          {loading ? "Processing..." : "Upload"}
        </button>

        {loading && (
          <p className="upload-loading">Detecting faces, please wait...</p>
        )}

        {result && !loading && (
          <div className="upload-result">
            <p><strong>Total Faces Detected:</strong> {result.total}</p>
            <p><strong>Unknown Faces:</strong> {result.unknown}</p>

            <h3>Present Students</h3>
            {result.present.length === 0 ? (
              <p className="no-known">No known faces found</p>
            ) : (
              <ul className="present-list">
                {result.present.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
