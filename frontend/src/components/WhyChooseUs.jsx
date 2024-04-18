import React from 'react';

function WhyChooseUs() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-white text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-md">
            <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20l5.5-2.5m8.5 2.5L19 20m0 0L12 9l7-4-7 4-7-4-1.5 11.5L12 9l7 4z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Advanced Analysis</h3>
            <p className="text-center text-gray-700">ResuFit offers advanced resume analysis tools that provide in-depth insights into your resume's strengths and areas for improvement.</p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-md">
            <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12L16 16L20 20" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Personalized Recommendations</h3>
            <p className="text-center text-gray-700">Receive personalized recommendations tailored to your resume, helping you enhance its effectiveness and optimize your job application process.</p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-md">
            <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Efficient Workflow</h3>
            <p className="text-center text-gray-700">Streamline your resume editing process with ResuFit's user-friendly interface and efficient workflow, saving you time and effort.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;