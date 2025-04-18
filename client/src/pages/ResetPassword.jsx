import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { HiOutlineMail } from 'react-icons/hi';
import { SlEye } from 'react-icons/sl';
import { FaEyeSlash } from 'react-icons/fa6';
import { RiLockPasswordFill } from 'react-icons/ri';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function ResetPassword() {
  const {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  } = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState('password');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setOtpSubmited] = useState(false);

  const handleSubmit = () => {};

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

  const handlePasswordView = () => {
    showPassword === 'password'
      ? setShowPassword('text')
      : setShowPassword('password');
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-reset-otp',
        { email },
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    setOtp(otpArray.join(''));
    setOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/reset-password',
        {
          email,
          otp,
          newPassword: password,
        },
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onSubmit={handleSubmit}
      className="flex px-2 flex-wrap items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400"
    >
      <img
        onClick={() => navigate('/')}
        className="w-20 rounded-full  absolute top-5 left-2 sm:left-26  cursor-pointer"
        src={assets.logo}
        alt="logo"
      />
      {/* enter email id */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm "
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>

          <div className="mb-4  flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <HiOutlineMail className="w-6 h-6" />
            <input
              type="email"
              placeholder="Email id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Send OTP
          </button>
        </form>
      )}

      {/* otp verify enter field form */}
      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm px-2 "
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password OTP
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
          <button className="w-full py-2.5  bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* enter new password form  */}
      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm "
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>

          <div className="mb-4  flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c]">
            <RiLockPasswordFill className="w-6 h-6" />

            <input
              type={`${showPassword}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent outline-none text-white"
            />
            {showPassword === 'text' ? (
              <FaEyeSlash
                className="w-6 h-6 cursor-pointer"
                onClick={handlePasswordView}
              />
            ) : (
              <SlEye
                className="w-6a h-6 cursor-pointer"
                onClick={handlePasswordView}
              />
            )}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
