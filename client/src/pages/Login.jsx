import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { IoPerson } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SlEye } from 'react-icons/sl';
import { FaEyeSlash } from 'react-icons/fa6';

function Login() {
  const [showPassword, setShowPassword] = useState('password');
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const [state, setState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePasswordView = () => {
    showPassword === 'password'
      ? setShowPassword('text')
      : setShowPassword('password');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          name: formData.fullname,
          email: formData.email,
          password: formData.password,
        });
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        console.log(data);

        if (data.success) {
          setIsLoggedin(true);
          localStorage.setItem('token', data.token1);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center  justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/')}
        className="w-20 rounded-full absolute top-5 left-5 sm:left-10 lg:left-16 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      <div className="bg-slate-900 p-2 sm:p-8 mt-5 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm max-w-md">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === 'Sign Up'
            ? 'Create your account'
            : 'Login to your account!'}
        </p>

        <form onSubmit={handleSubmit}>
          {state === 'Sign Up' && (
            <div className="mb-4 w-full flex gap-2 border-2 items-center rounded-full bg-[#333A5c] px-3 py-2">
              <IoPerson />
              <input
                onChange={handleInput}
                name="fullname"
                type="text"
                value={formData.fullname}
                placeholder="Full Name"
                required
                className="bg-transparent outline-none text-white"
              />
            </div>
          )}
          <div className="mb-4 w-full flex gap-2 border-2 items-center rounded-full bg-[#333A5c] px-3 py-2">
            <MdEmail />
            <input
              onChange={handleInput}
              value={formData.email}
              name="email"
              type="email"
              placeholder="Email id"
              required
              className="bg-transparent outline-none text-white"
            />
          </div>
          <div className="mb-4 w-full flex gap-2 border-2 items-center justify-between rounded-full bg-[#333A5c] pl-3 py-2">
            <div className="flex gap-2 items-center">
              {' '}
              <RiLockPasswordFill />
              <input
                onChange={handleInput}
                value={formData.password}
                name="password"
                type={`${showPassword}`}
                placeholder="Password"
                required
                className="bg-transparent outline-none text-white"
              />
            </div>
            <div className=" pr-2">
              {showPassword === 'text' ? (
                <FaEyeSlash
                  className="w-6 h-6 cursor-pointer"
                  onClick={handlePasswordView}
                />
              ) : (
                <SlEye
                  className="w-6 h-6 cursor-pointer"
                  onClick={handlePasswordView}
                />
              )}
            </div>
          </div>
          <p
            onClick={() => navigate('/reset-password')}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            {state}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className="text-blue-400 cursor-pointer underline "
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className="text-blue-400 cursor-pointer underline "
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
