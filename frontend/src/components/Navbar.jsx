import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, animateScroll as scroll } from 'react-scroll';

function Navbar({ authService }) {
  Navbar.propTypes = {
    authService: PropTypes.shape({
      isAuthenticated: PropTypes.func.isRequired,
      logout: PropTypes.func.isRequired,
      getUserDetails: PropTypes.func.isRequired,
    }).isRequired,
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.isAuthenticated();
      if (user) {
        setIsAuthenticated(true);
        setUserName(user.name);
        setUserEmail(user.email);
      }
    };

    checkAuth();
  }, [authService]);

  const handleLogout = async () => {
    if (authService) {
      await authService.logout();
      setIsAuthenticated(false);
      setUserName('');
      setUserEmail('');
    }
  }

  const handleLoginClick = () => {
    window.location.href = '/login';
  };
  const handleSignupClick = () => {
    window.location.href = '/signup';
  };

  const handleProfileClick = () => {
    window.location.href = '/profile';
  }

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  }

  // fetch user details when dropdown is opened
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isDropdownVisible && isAuthenticated) {
        const userDetails = await authService.getUserDetails();
        setUserName(userDetails.name);
        setUserEmail(userDetails.email);
      }
    };

    fetchUserDetails();
  }, [isDropdownVisible, isAuthenticated, authService]);

  return (

    <nav className="bg-gradient-to-r from-blue-400 to-purple-500 border-b border-gray-200 dark:bg-gray-900">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        <Link
          to="hero-section"
          smooth={true}
          duration={500}
          className="text-2xl font-bold cursor-pointer text-white"
        >
          ResuFit
        </Link>
        <div className="flex items-center space-x-4">
          <ul className="flex flex-grow justify-center space-x-4">
            <li>
              <Link
                to="hero-section"
                smooth={true}
                duration={500}
                className="text-white hover:text-blue-600 cursor-pointer"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="features"
                smooth={true}
                duration={500}
                className="text-white hover:text-blue-600 cursor-pointer"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="services"
                smooth={true}
                duration={500}
                className="text-white hover:text-blue-600 cursor-pointer"
              >
                Services
              </Link>
            </li>
          </ul>
          <div className="flex space-x-4 ml-auto">

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleDropdown} className="text-white focus:outline-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isDropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-gray-500">{userName}</span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{userEmail}</span>
                    </div>
                    <div className='items-center justify-between md:flex md:w-auto md:order-1' id='navbar-cta'>
                      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 py-2" aria-labelledby="user-menu-button">
                        <li>
                          <button onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white focus:outline-none">
                            Profile
                          </button>
                        </li>
                        <li>
                          <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white focus:outline-none">
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={handleLoginClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Login</button>
                <button onClick={handleSignupClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Signup</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;