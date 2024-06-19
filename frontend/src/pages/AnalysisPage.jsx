import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

function AnalysisPage() {
  const { resumeId } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_URL}/${resumeId}/analyze`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analysis data');
        }

        const data = await response.json();
        setAnalysisData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analysis data: ', error);
        throw new Error(error.message || 'Analysis data is not fetched');
      }
    };

    fetchAnalysisData();
  }, [resumeId]);

  const renderAnalysisData = () => {
    if (!analysisData) return null;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-blue-600 text-center mb-8">Resume Analysis Report</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-600">Phone Numbers:</h4>
                  <ul className="list-disc pl-8">
                    {analysisData.contact_information.phone_numbers.map((phone, index) => (
                      <li className='text-black' key={index}>{phone}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-600">Emails:</h4>
                  <ul className="list-disc pl-8 text-black">
                    {analysisData.contact_information.emails.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Education Information</h3>
              <ul className="list-disc pl-8">
                {analysisData.education_information.map((education, index) => (
                  <li className='text-black' key={index}>{education}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Experience Information</h3>
              <ul className="list-disc pl-8">
                {analysisData.experience_information.map((experience, index) => (
                  <li className='text-black' key={index}>{experience}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills Information</h3>
              <ul className="list-disc pl-8">
                {analysisData.skills_information.map((skill, index) => (
                  <li className='text-black' key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Similarity Score</h3>
              <p className="text-blue-600">{analysisData.similarity_score}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        renderAnalysisData()
      )}
    </div>
  );
}

export default AnalysisPage;
