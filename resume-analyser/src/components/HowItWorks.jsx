import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadModal from './modals/UploadModal';
import LoginModal from './modals/LoginModal';
import JobDescriptionModal from './modals/JobDescriptionModal';
import AnalysisReportModal from './modals/AnalysisReportModal';
import '../assests/styles/howitworks.css';

const HowItWorks = () => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isJobDescriptionModalOpen, setJobDescriptionModalOpen] = useState(false);
  const [isAnalysisReportModalOpen, setAnalysisReportModalOpen] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const token = localStorage.getItem('token');
      if (!token) {
        //alert('User not authenticated. Please logg in.');
        setLoginModalOpen(true);
        return;
      }

      //api call
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      //handle response from server
      console.log("Resume uploaded successfully:", response.data.resume);
      setUploadedResume(file);
      setUploadModalOpen(false);
      setJobDescriptionModalOpen(true);
    } catch (error) {
      console.error('Error uploading resume:', error.message);
    }
  };

  const handleLogin = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3001/login', userData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setLoginModalOpen(false);
    } catch (error) {
      console.error('Error logging in: ', error.message);
    }
  };

  const handleAnalysis = async () => {
    try {
      // Simulate analysis logic here
      const response = await axios.get('http://localhost:3001/analyze', {
        jobDescription
      });

      // Handle response from the server
      console.log(response.data);
      setAnalysisData(response.data);
      setJobDescriptionModalOpen(false);
      setAnalysisReportModalOpen(true);
    } catch (error) {
      console.error('Error analyzing resume:', error.message);
    }
  };

  return (
    <div className="how-it-works-container">
      {isLoggedIn ? (
        <button onClick={() => setUploadModalOpen(true)}>Upload Your Resume</button>
      ) : (
        <button onClick={() => setLoginModalOpen(true)}>Login to Upload Resume</button>
      )}

      {isUploadModalOpen && <UploadModal onUpload={handleUpload} onClose={() => setUploadModalOpen(false)} />}
      {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setLoginModalOpen(false)} />}
      {isJobDescriptionModalOpen && (
        <JobDescriptionModal
          onAnalysis={handleAnalysis}
          onJobDescriptionChange={(value) => setJobDescription(value)}
          onClose={() => setJobDescriptionModalOpen(false)}
        />
      )}
      {isAnalysisReportModalOpen && (
        <AnalysisReportModal
          analysisData={analysisData}
          onClose={() => setAnalysisReportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HowItWorks;
