import React, { useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

function EmailVerify() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);

  const inputRef = useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePast = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
    inputRef.current[inputRef.length - 1].focus();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join('');
      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp },
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/');
  });

  return (
    <div className="flex w-fit h-185 sm:w-full items-center px-1 justify-center sm:min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/')}
        className="w-20 rounded-full  absolute top-5 left-2 sm:left-26  cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm "
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePast}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md
              "
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full cursor-pointer">
          Verify
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
