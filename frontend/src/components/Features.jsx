import React from 'react';

function Features() {
  return (
    <section className="py-16 bg-gray-100" id='features'>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
            <svg className="w-12 h-12 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy to Use</h3>
            <p className="text-gray-700 text-center">Our platform is designed with simplicity in mind, making it easy for users to upload and analyze their resumes effortlessly.</p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
            <svg className="w-12 h-12 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 6h-2a2 2 0 0 0-2 2v8"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Analysis</h3>
            <p className="text-gray-700 text-center">Utilizing the latest technologies, our platform provides in-depth analysis of your resume to help you stand out from the crowd.</p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
            <svg className="w-12 h-12 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4v4m0 0V3m0 4h4m-4 0H8m8 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V11m0 0H4v6h16v-6z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Feedback</h3>
            <p className="text-gray-700 text-center">Get instant feedback on your resume, including suggestions for improvement, helping you optimize your chances of success.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
