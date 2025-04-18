import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { MdSwipeRightAlt } from 'react-icons/md';
import { FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const { backendUrl, userData, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Send verification OTP
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
      );
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout logic
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        localStorage.removeItem('token');
        setIsLoggedin(false);
        setUserData(null);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50 px-4 sm:px-10 py-3 flex items-center justify-between">
      {/* Logo and title */}
      <div className="flex items-center gap-3">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-12 sm:w-16 rounded-full cursor-pointer"
          onClick={() => navigate('/')}
        />
        <span className="text-lg sm:text-2xl font-bold text-gray-800">
          patell
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {userData ? (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full text-lg font-medium cursor-pointer"
            >
              {userData.name[0].toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-20">
                <ul className="text-sm text-gray-700 py-2">
                  {!userData.isAccountVerified && (
                    <li
                      onClick={() => {
                        sendVerificationOtp();
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Verify Email
                    </li>
                  )}
                  <li
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 border border-gray-400 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            Login <MdSwipeRightAlt className="text-xl" />
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 right-4 w-56 bg-white shadow-lg border border-gray-200 rounded-md z-30 md:hidden transition-all duration-200">
          <ul className="flex flex-col text-gray-700 text-sm">
            {userData ? (
              <>
                <li className="px-4 py-3 font-medium">
                  Hello, {userData.name.split(' ')[0]}
                </li>
                {!userData.isAccountVerified && (
                  <li
                    onClick={() => {
                      sendVerificationOtp();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </>
            ) : (
              <li
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                Login <MdSwipeRightAlt className="text-xl" />
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
