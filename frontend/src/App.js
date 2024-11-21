// src/App.js

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage'; 
import SignUpPage from './components/SignUpPage'; 
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Route for the About Page */}
          <Route path="/about" element={<AboutPage />} />

          {/* Route for the Sign Up Page */}
          <Route path="/signup" element={<SignUpPage />} /> 

          {/* Route for the Log In Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route for the Dashboard Page */}
          <Route path="/dashboard" element={<DashboardPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
