import React, { useState } from 'react';

const API_URL = 'http://localhost:3001';

function Analyse() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [flashMessage, setFlashMessage] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  }

  const handleAnalyzeClick = async () => {
    try {
      if (!selectedFile) {
        throw new Error('Please upload a file before analyzing.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobDescription', jobDescription);

      const responseUpload = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseDataUpload = await responseUpload.json();
      if (!responseUpload.ok) {
        throw new Error(responseDataUpload.error || 'Failed to upload resume.');
      }

      // extract resumeId from the response
      const resumeId = responseDataUpload.resume._id;
      
      const responseAnalysis = await fetch(`${API_URL}/${resumeId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await responseAnalysis.json();

      if (!responseAnalysis.ok) {
        throw new Error(data.message || 'Failed to analyze resume.');
      }

      if (!data || data.error) {
        throw new Error(data.error || 'Invalid response from server');
      }

      console.log(data);
    } catch (error) {
      console.error('Error analyzing resume: ', error);
      throw new Error(error.message || 'Invalid response');
    }
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
      console.log(responseData);
    
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to upload resume.');
      }
    
      if (!responseData.success) {
        throw new Error(responseData.message || 'An error occurred while uploading the resume.');
      }
    
      // Update the selectedFile state with the response data
      setSelectedFile(responseData.resume);
    
      // Clear any previous error message
      setFlashMessage('');
      setFlashMessage(responseData.message || 'Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading resume: ', error);
      // Set the error message
      setFlashMessage(error.message || 'An error occurred while uploading the resume.');
    } finally {
      // Move the modal open state update inside the try block
      setModalOpen(true);
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
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <div className='bg-white p-8 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>Upload Job Description</h2>
            <div className='flex justify-between'>
              {/* Display uploaded resume */}
              <div className='w-1/2'>
                <h3 className='text-lg font-semibold mb-2 text-gray-700'>Uploaded Resume:</h3>
                <p className='text-gray-600'>{selectedFile ? selectedFile.name : 'No file uploaded'}</p>
              </div>
              {/* Input field for job description */}
              <div className='w-1/2'>
                <h3 className='text-lg font-semibold mb-2 text-gray-700'>Job Description</h3>
                <textarea
                  className='w-full h-24 border border-gray-300 rounded-md p-2 resize-none text-black'
                  value={jobDescription}
                  onChange={handleDescriptionChange}
                  placeholder='Enter job description here...'
                ></textarea>
              </div>
            </div>
            <div className='mt-4 flex justify-end'>
              {/* Button to trigger resume analysis */}
              <button
                type='button'
                onClick={handleAnalyzeClick}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-4 py-2.5 text-sm'
              >
                Analyze Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Analyse;