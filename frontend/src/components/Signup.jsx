import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const API_URL = 'http://localhost:3001';

function Signup({ setShowSuccessPopup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (!username || !email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      //send post request to signup endpoint
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      if (response.ok) {
        //set success popup to true and navigate to home page
        setShowSuccessPopup(true);
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Signup failed');
        console.error('Signup failed:', errorData.error);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An error occurred while signing up');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-8 text-blue-600">Create an Account</h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="username"
              name="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm text-black border-gray-300 rounded-md"
              placeholder="Enter your name" required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm text-black border-gray-300 rounded-md" 
              placeholder="Enter your email" required 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm text-black border-gray-300 rounded-md" 
            placeholder="Enter your password" required 
          />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm text-black border-gray-300 rounded-md" 
              placeholder="Confirm your password" required 
            />
          </div>
          <div>
            {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign Up</button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">Already have an account? <a href="/login" className="text-blue-600 font-semibold hover:underline">Log In</a></p>
      </div>
    </div>
    </div>
  );
}

export default Signup;
