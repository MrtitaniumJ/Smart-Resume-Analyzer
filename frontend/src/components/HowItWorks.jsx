import React from 'react';

function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-400 to-blue-500 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center justify-center bg-white bg-opacity-20 p-8 rounded-lg shadow-md">
            <svg className="w-12 h-12 text-white mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h3 className="text-xl font-semibold mb-4">Upload Your Resume</h3>
            <p className="text-center">Start by uploading your resume to our platform. We support various file formats for your convenience.</p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center justify-center bg-white bg-opacity-20 p-8 rounded-lg shadow-md">
            <svg className="w-12 h-12 text-white mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <h3 className="text-xl font-semibold mb-4">Analyze Your Resume</h3>
            <p className="text-center">Our advanced algorithms will analyze your resume and provide you with detailed insights and feedback.</p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center justify-center bg-white bg-opacity-20 p-8 rounded-lg shadow-md">
            <svg className="w-12 h-12 text-white mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <h3 className="text-xl font-semibold mb-4">Receive Feedback</h3>
            <p className="text-center">Get instant feedback on your resume, along with suggestions for improvement to enhance your chances.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
