import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer, toast } from 'react-toastify';
import NotLoggedIn from './components/NotLoggedIn';
import PageNotFound from './components/PageNotFound';
import LoggedIn from './components/LoggedIn';

function App() {
  return (
    <div className="select-none ">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<NotLoggedIn />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<LoggedIn />}>
          <Route path="/email-verify" element={<EmailVerify />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
