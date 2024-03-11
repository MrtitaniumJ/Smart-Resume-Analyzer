import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assests/images/logo192.png';
import '../assests/styles/navbar.css';

const API_URL = 'http://localhost:3001/api';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        //check if the user is logged in by checking if there is a token in local storage
        const token = localStorage.getItem('token');
        setIsLoggedIn(token ? true : false);

        if (token) {
            fetchUserInfo();
        }
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${API_URL}/user`, {
                headers: {
                    method: 'GET',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    //handle user logout
    const handleLogout = async () => {
        try {
            //retrieve token from local storage
            const token = localStorage.getItem('token');
            //make a POST request to the backend logout route
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`     //include the JWT token in the Authorization header
                },
                //body: JSON.stringify({}),
            });

            //check if the logout request was successful
            if (response.ok) {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setUser(null);
                setShowDropdown(false);
                window.location.href = '/login';
            } else {
                // Handle error if logout request fails
                console.error('Logout request failed');
            }
        } catch (error) {
            console.error('Error logging out: ', error);
        }
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/" className="logo-link">
                        <img src={logo} alt="Resume Analyzer Logo" className="logo" />
                        ResuFit
                    </Link>
                </div>
                <div className="navbar-links">
                    <ul>
                        <li><Link to="/" className="nav-link">Home</Link></li>
                        <li><Link to="/about" className="nav-link">About</Link></li>
                        <li><Link to="/services" className="nav-link">Services</Link></li>
                        <li><Link to="/contact" className="nav-link">Contact</Link></li>
                    </ul>
                </div>
                <div className="navbar-actions">
                    <div className="search-icon">
                        <FaSearch />
                    </div>
                    {isLoggedIn ? (
                        <div className="dropdown">
                            <div className="user-icon" onClick={() => setShowDropdown(!showDropdown)}>
                                <FaUser />
                            </div>
                            {showDropdown && (
                                <div className="dropdown-content">
                                    <p>Name: {user && user.username}</p>
                                    <p>Email: {user && user.email}</p>
                                    <button onClick={handleLogout} className='btn logout-btn'>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn login-btn">Login</Link>
                            <Link to="/register" className="btn signup-btn">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
