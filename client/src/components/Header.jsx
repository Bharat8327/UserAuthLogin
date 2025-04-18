import React, { useContext } from 'react';
import homepage from '../../public/homepage.png';
import { AppContent } from '../context/AppContext';

function Header() {
  const { userData } = useContext(AppContent);
  console.log('from the herader', userData);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800 ">
      <img src={homepage} alt="" className="w-36 h-36 rounded-full mb-6" />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : 'Devloper'}! 👋
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>
      <p className="mb-8 max-w-md">
        Let's start with a quick product tour and we will you up and running in
        no time!
      </p>
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer">
        Get Started
      </button>
    </div>
  );
}

export default Header;
