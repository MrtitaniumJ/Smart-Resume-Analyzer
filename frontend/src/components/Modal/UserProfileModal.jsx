import React, { useState } from 'react'
import PropTypes from 'prop-types';
import Avatar from '../../assets/Jatin-profile.jpeg.jpg';

function UserProfileModal({ user }) {
    // state and functions for profile upload, editing, deletion
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleEditClick = () => {
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
        <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            {/* Background overlay */}
            <div className='fixed inset-0 transition-opacity' aria-hidden="true">
                <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>
            <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden="true">&#8203;</span>
            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                    <div className='sm:flex sm:items-start'>
                        <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100'>
                            {/* Display profile image or default avatar */}
                            {/* <img className='h-10 w-10 rounded-full' src={user.profileImage || '../../assets/react.svg'} /> */}
                            <img className='h-10 w-10 rounded-full' src={Avatar} />
                        </div>
                        <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                            <h3 className='text-lg leading-6 font-medium text-gray-900'>Jatin</h3>
                            <p className='text-sm text-gray-500'>email@gmail.com</p>
                            <p className='text-sm text-gray-500'>Resume</p>
                        </div>
                    </div>
                </div>
                <div className='bg-'></div>
            </div>
        </div>
    </div>
  )
}

export default UserProfileModal
