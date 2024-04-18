import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const API_URL = 'http://localhost:3001';

function Login({ setShowSuccessPopup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const data = await response.json();
      const { token, user } = data;

      //store token and user data in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      //clear input fields
      setEmail('');
      setPassword('');
      setError('');

      //Navigate to home page
      setShowSuccessPopup(true);
      navigate('/');
    } catch (error) {
      console.error('Login error: ', error);
      setError(error.message || 'An unexpected error occured. Please try again later.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-8 text-blue-600">Welcome Back!</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm text-black border-gray-300 rounded-md" 
              placeholder="Enter your email" 
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
              placeholder="Enter your password" 
            />
          </div>
          <div>
            {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Login</button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">Don't have an account? <a href="/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</a></p>
      </div>
    </div>
    </div>
  );
}

export default Login;
