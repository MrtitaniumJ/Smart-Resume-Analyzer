import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assests/styles/Signup.css';

const API_URL = 'http://localhost:3001';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            if (!username || !email || !password || !confirmPassword) {
                setError('All fields are required');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            //send POST request to signup endpoint
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confirmPassword }),
            });

            if (response.ok) {
                navigate('/login');
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
        <div className='signup-container'>
            <h2>Sign Up</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <div className='error-message'>{error}</div>}
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;
