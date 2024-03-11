import React, { useState } from 'react';
import '../../assests/styles/modals/jobdescriptionmodal.css';

const JobDescriptionModal = ({ onClose, onAnalyze }) => {
  const [jobDescription, setJobDescription] = useState('');

  const handleAnalyze = () => {
    if (!jobDescription) {
      alert('Please enter job description.');
      return;
    }
    onAnalyze(jobDescription);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="job-description-modal">
        <div className="modal-header">
          <h2>Enter Job Description</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="modal-content">
          <textarea
            rows="6"
            placeholder="Enter job description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button className="analyze-btn" onClick={handleAnalyze}>Analyze Resume</button>
        </div>
      </div>
    </div>
  );
}

export default JobDescriptionModal;
