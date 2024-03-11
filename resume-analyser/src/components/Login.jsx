import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assests/styles/Login.css';

const API_URL = 'http://localhost:3001/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                // Login failed
                setError(data.error || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while logging in');
        }
    };

    useEffect(() => {
        setError('');
    }, [email, password]);

    return (
        <div className='login-container'>
            <h2>Login</h2>
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
            {error && <div className='error-message'>{error}</div>}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;