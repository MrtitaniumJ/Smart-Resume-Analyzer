import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

function ProfileSection({ userData, error }) {
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    const { username, userEmail, profileImage, uploadedResumes } = userData;

    return (
        <section className='bg-gradient-to-r from-blue-400 to-purple-500 py-20 h-screen'>
            <div className='container mx-auto px-4'>
                <div className='max-w-3xl mx-auto'>
                    <div className='bg-white bg-opacity-20 p-8 rounded-lg shadow-md'>
                        <div className='flex items-center justify-between mb-8'>
                            <div className='flex items-center'>
                                <div className='h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden'>
                                    <img src={userData.profileImage} alt="Profile" className='h-full w-full object-cover' />
                                </div>
                                <div>
                                    <h2 className='text-2xl font-bold text-gray-800'>{username}</h2>
                                    <p className='text-gray-600'>{userEmail}</p>
                                </div>
                            </div>
                            <button className='text-sm text-blue-600 hover:text-blue-700'>Edit Profile</button>
                        </div>
                        <div className='border-t border-gray-200 pt-8'>
                            <h3 className='text-lg font-semibold mb-4 text-gray-900'>Uploaded Resumes</h3>
                            {uploadedResumes.length === 0 ? (
                                <p className='text-gray-500'>No resumes uploaded</p>
                            ) : (
                                <ul className='space-y-4'>
                                    {uploadedResumes.map((resume) => (
                                        <li key={resume.resumeId} className='flex items-center space-x-4'>
                                            <svg className='w-6 h-6 text-gray-600' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className='text-gray-800'>{resume.filename}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

ProfileSection.propTypes = {
    userData: PropTypes.shape({
        username: PropTypes.string.isRequired,
        userEmail: PropTypes.string.isRequired,
        profileImage: PropTypes.string.isRequired,
        uploadedResumes: PropTypes.arrayOf(
            PropTypes.shape({
                resumeId: PropTypes.string.isRequired,
                filename: PropTypes.string.isRequired,
            })
        ).isRequired,
    }),
    error: PropTypes.string,
};

export default ProfileSection;
