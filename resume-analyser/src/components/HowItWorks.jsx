import React, { useState } from 'react';
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

  const handleUpload = (file) => {
    // Simulate uploading the resume to the database
    setUploadedResume(file);
    setUploadModalOpen(false);
    setJobDescriptionModalOpen(true);
  };

  const handleLogin = () => {
    // Your login logic here
    setLoginModalOpen(false);
    // After successful login, open the upload modal
    setUploadModalOpen(true);
  };

  const handleAnalysis = () => {
    // Simulate analysis logic here
    const analysisResult = {
      // Sample analysis data, replace with actual logic
      contactInfo: true,
      jobTitleMatch: true,
      educationMatch: true,
      sectionHeadings: 'Valid',
      dateFormat: 'Valid',
      skillsComparison: 'Excellent',
      highlightedSkills: ['React', 'Node.js'],
      softSkillsComparison: 'Good',
      highlightedSoftSkills: ['Communication', 'Teamwork'],
      otherKeywords: ['Agile', 'Problem-solving'],
      matchedSkills: ['React', 'Node.js', 'Communication'],
      missingSkills: ['Java', 'Python'],
      overallScore: 85,
      suggestedCourses: ['Advanced React', 'Effective Communication'],
    };
    setAnalysisData(analysisResult);
    setJobDescriptionModalOpen(false);
    setAnalysisReportModalOpen(true);
  };

  return (
    <div className="how-it-works-container">
      {/* Main content of your page */}
      {/* Button to trigger file upload */}
      <button onClick={() => setUploadModalOpen(true)}>Upload Your Resume</button>

      {/* Modals */}
      {isUploadModalOpen && <UploadModal onUpload={handleUpload} onClose={() => setUploadModalOpen(false)} />}
      {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setLoginModalOpen(false)} />}
      {isJobDescriptionModalOpen && (
        <JobDescriptionModal
          uploadedResume={uploadedResume}
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
