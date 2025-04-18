import React, { useContext } from 'react';
import homepage from '../../public/homepage.png';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!userData) {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 sm:px-10 mt-24 mb-16 text-gray-800">
      {/* 3D-style Background Blob */}
      <div className="absolute -z-10 top-0 blur-3xl left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-full opacity-30 animate-pulse" />

      {/* Avatar Image */}
      <img
        src={homepage}
        alt="Welcome"
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full mb-6 shadow-xl ring-4 ring-white hover:scale-105 transition-transform duration-300"
      />

      {/* Greeting Text */}
      <h1 className="text-xl sm:text-2xl font-medium mb-1">
        Hey{' '}
        <span className="text-indigo-600 font-bold">
          {userData ? userData.name : 'Developer'}
        </span>
        ! 👋
      </h1>
      <h2 className="text-3xl sm:text-5xl font-extrabold mb-3">
        Welcome to Our App
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-md mb-8">
        Let’s explore your dashboard with a fresh, interactive experience!
      </p>

      {/* 3D-style Button */}
      <button
        onClick={handleGetStarted}
        className="bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-600 shadow-xl text-white px-10 py-3 rounded-full text-sm sm:text-base font-semibold transform hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {userData ? 'Homepage' : 'Get Started'}
      </button>
    </div>
  );
}

export default Header;
