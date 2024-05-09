import React from 'react';

function ResumeModal({ selectedFile, jobDescription, handleDescriptionChange, handleAnalyzeClick }) {
  console.log('Rendering ResumeModal');
  return (
    <div className='fixed top-0 left-0 w-full flex items-center justify-center bg-opacity-50 z-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold mb-4 text-gray-800'>Upload Job Description</h2>
        <div className='flex justify-between'>
          <div className='w-1/2'>
            <h3 className='text-lg font-semibold mb-2 text-gray-700'>Uploaded Resume:</h3>
            <p className='text-gray-600'>{selectedFile ? selectedFile.name : 'No file uploaded'}</p>
          </div>
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
  );
}

export default ResumeModal;
