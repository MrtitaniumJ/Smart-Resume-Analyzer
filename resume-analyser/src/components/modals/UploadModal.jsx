import React, { useState } from 'react';
import '../../assests/styles/modals/uploadmodals.css';

const API_URL = 'http://localhost:3001/api'; // Update with your actual backend API URL

const UploadModal = ({ onClose }) => {
  const [file, setFile] = useState(null);

  const uploadResumeToDatabase = async (resumeFile) => {
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const token = localStorage.getItem('token'); // Assuming you store the authentication token in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume to the database');
      }

      const data = await response.json();
      return data.resumeId;
    } catch (error) {
      console.error('Error uploading resume:', error.message);
      throw error;
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      const resumeId = await uploadResumeToDatabase(file);
      console.log('Resume uploaded successfully with ID:', resumeId);

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
