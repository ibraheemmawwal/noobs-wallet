import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage';
import SetpinPage from './pages/SetpinPage';
import Dashboard from './pages/Dashboard';

import './App.css';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/verify" element={<VerifyPage />} />
          <Route path="/signup/setpin" element={<SetpinPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
