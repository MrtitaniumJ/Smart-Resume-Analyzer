import React, { useState, useEffect } from 'react'
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
          method: "POST",
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

  // Function to render analysis data
  const renderAnalysisData = () => {
    if (!analysisData) return null;
  
    const { contact_information, education_information, experience_information, skills_information, similarity_score } = analysisData;
  
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Analysis Report</h3>
        <div>
          <h4 className="font-medium">Contact Information:</h4>
          <div>
            <h5>Phone Numbers:</h5>
            <ul>
              {contact_information && contact_information.phone_numbers && contact_information.phone_numbers.length > 0 ? (
                contact_information.phone_numbers.map((phone, index) => (
                  <li key={index}>{phone}</li>
                ))
              ) : (
                <p>No phone numbers found</p>
              )}
            </ul>
            <h5>Emails:</h5>
            <ul>
              {contact_information && contact_information.emails && contact_information.emails.length > 0 ? (
                contact_information.emails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))
              ) : (
                <p>No emails found</p>
              )}
            </ul>
          </div>
        </div>
        <div>
          <h4 className="font-medium">Education Information:</h4>
          <ul>
            {education_information && education_information.map((education, index) => (
              <li key={index}>{education}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Experience Information:</h4>
          <ul>
            {experience_information && experience_information.map((experience, index) => (
              <li key={index}>{experience}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Skills Information:</h4>
          <ul>
            {skills_information && skills_information.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Similarity Score:</h4>
          <p>{similarity_score}</p>
        </div>
      </div>
    );
  };

  return (
    <div className='container mx-auto mt-8'>
      <h2 className='text-3x1 font-semibold text-blue-600 text-center mb-8'>Resume Analysis Report</h2>
      {isLoading ? (
        <div className='text-center'>
          <p>Loading...</p>
        </div>
      ) : (
        <div className='max-w-lg mx-auto'>
          {renderAnalysisData()}
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;
