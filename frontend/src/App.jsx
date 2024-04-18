import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './pages/Profile';
import SuccessPopup from './components/SuccessPopup';

const API_URL = 'http://localhost:3001'

function App() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [setError] = useState('');

  const authService = {
    isAuthenticated: async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch (`${API_URL}/user`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const user = await response.json();
            return user;
          } else {
            throw new Error('Failed to fetch user details');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError(error.message || 'Error fetching in user details');
        }
      } else {
        return null;
      }
    },
    getUserDetails: async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            return user;
          } else {
            throw new Error('Failed to fetch user details');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError(error.message || 'Error fetching in user details');
        }
      } else {
        return null;
      }
    },
    logout: async () => {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <div className='container'>
        {/* show success popup if user is logged in */}
        {showSuccessPopup && <SuccessPopup message="User registered successfully" />}
      <Routes>
        <Route exact path='/' element={<Home setShowSuccessPopup={setShowSuccessPopup} authService={authService} />} />
        <Route exact path='/login' element={<Login setShowSuccessPopup={setShowSuccessPopup} />} />
        <Route exact path='/signup' element={<Signup setShowSuccessPopup={setShowSuccessPopup} />} />
        <Route exact path='/profile' element={<Profile />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
