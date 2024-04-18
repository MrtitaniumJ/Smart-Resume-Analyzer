import React, { useState } from 'react';
import axios from 'axios';
import '../../assests/styles/modals/uploadmodals.css';

const API_URL = 'http://localhost:3001/';

const UploadModal = ({ onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      const formData = new FormData();
      formData.append('resume', file);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated. Please log in.');
        return;
      }

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Resume uploaded successfully:', response.data.resume);
      onClose();
    } catch (error) {
      console.error('Error uploading resume:', error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <h2>Upload Resume</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="modal-content">
          <input type="file" accept=".docx,.pdf" onChange={handleFileChange} />
          <button className="upload-btn" onClick={handleUpload}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
