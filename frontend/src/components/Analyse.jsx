import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ResumeModal from './Modal/ResumeModal';

const API_URL = 'http://localhost:3001';

function Analyse() {
  const history = useHistory();
  const [selectedFile, setSelectedFile] = useState(null);
  const [flashMessage, setFlashMessage] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [analysisData, setAnalysisData] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const uploadResume = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
  
      if (!selectedFile) {
        throw new Error('Please select a file to upload.');
      }
  
      const formData = new FormData();
      formData.append('resume', selectedFile);
  
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const responseData = await response.json();
  
      console.log('Response Data:', responseData);
      console.log('Response Status:', response.status);
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to upload resume.');
      }

      if (!responseData.resume || !responseData.resume._id) {
        throw new Error('Resume ID not found in the server response');
      }
  
      setResumeId(responseData.resume._id);
  
      setSelectedFile(responseData.resume);
  
      setFlashMessage(responseData.message);
      setModalOpen(true);
    } catch (error) {
      console.error('Error uploading resume: ', error);
      setFlashMessage(error.message || 'An error occurred while uploading the resume.');
    }
  };  

  const handleAnalyzeClick = async () => {
    try {
      if (!selectedFile) {
        throw new Error('Please upload a file before analyzing.');
      }
  
      if (!jobDescription) {
        throw new Error('Please enter a job description.');
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
  
      if (!resumeId) {
        throw new Error('Resume Id not found. Please upload the resume again.');
      }
  
      const responseAnalysis = await fetch(`${API_URL}/${resumeId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobDescription: jobDescription
        }),
      });
  
      const data = await responseAnalysis.json();
  
      if (!responseAnalysis.ok) {
        throw new Error(data.error || 'Failed to analyze resume.');
      }
  
      console.log(data);

      setAnalysisData(data);

      setFlashMessage(data.message);

      history.push(`${API_URL}/${resumeId}/analyze`);
    } catch (error) {
      console.error('Error analyzing resume: ', error);
      setFlashMessage(error.message || 'Failed to analyze resume. Please try again later.');
    }
  };  

  return (
    <section className="py-16 bg-gradient-to-r from-blue-400 to-purple-500" id='services'>
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-blue-600 text-center mb-8">Analyse Your Resume</h2>
          <div className="flex flex-col items-center justify-center space-y-8">
            <form className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full">
                <div className="border-4 border-dotted border-blue-400 p-8 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-300">
                  <label htmlFor="resume-upload" className="flex flex-col items-center justify-center">
                    <input type="file" id="resume-upload" className="hidden" onChange={handleFileChange} />
                    <svg className="w-16 h-16 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    {selectedFile ? (
                      <p className="text-gray-600 font-medium text-lg">{selectedFile.name}</p>
                    ) : (
                      <p className="text-gray-600 font-medium text-lg">Drag and drop your file here or click to browse</p>
                    )}
                  </label>
                </div>
              </div>
              <button type="button" onClick={uploadResume} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Upload Resume
              </button>
            </form>
            {flashMessage && <div className="text-green-600">{flashMessage}</div>}
          </div>
        </div>
      </div>

      {/* modal for displaying uploaded resume and job description */}
      {modalOpen && (
        <ResumeModal
          selectedFile={selectedFile}
          jobDescription={jobDescription}
          handleDescriptionChange={handleDescriptionChange}
          handleAnalyzeClick={handleAnalyzeClick}
        />
      )}
    </section>
  );
}

export default Analyse;
