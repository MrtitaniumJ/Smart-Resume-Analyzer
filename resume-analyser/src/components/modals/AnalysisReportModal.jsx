import React from 'react';
import '../../assests/styles/modals/analysisreportmodal.css';

const AnalysisReportModal = ({ analysisData, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="analysis-report-modal">
        <div className="modal-header">
          <h2>Analysis Report</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="modal-content">
          <div className="section">
            <h3>Basic Information</h3>
            <p>Contact Info: {analysisData.contactInfo ? 'Present' : 'Not Present'}</p>
            <p>Job Title Match: {analysisData.jobTitleMatch ? 'Yes' : 'No'}</p>
            <p>Education Match: {analysisData.educationMatch ? 'Yes' : 'No'}</p>
            <p>Section Headings: {analysisData.sectionHeadings}</p>
            <p>Date Formatting: {analysisData.dateFormat}</p>
          </div>
          <div className="section">
            <h3>Hard Skills</h3>
            <p>Skills Comparison: {analysisData.skillsComparison}</p>
            <p>Highlighted Skills: {analysisData.highlightedSkills}</p>
          </div>
          <div className="section">
            <h3>Soft Skills</h3>
            <p>Skills Comparison: {analysisData.softSkillsComparison}</p>
            <p>Highlighted Skills: {analysisData.highlightedSoftSkills}</p>
            <p>Other Keywords: {analysisData.otherKeywords}</p>
          </div>
          <div className="section">
            <h3>Overall Analysis</h3>
            <p>Matched Skills: {analysisData.matchedSkills.join(', ')}</p>
            <p>Missing Skills: {analysisData.missingSkills.join(', ')}</p>
            <p>Overall Score: {analysisData.overallScore}</p>
          </div>
          <div className="section">
            <h3>Suggested Courses</h3>
            <ul>
              {analysisData.suggestedCourses.map(course => (
                <li key={course}>{course}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisReportModal;
