// src/App.js

import React, { useEffect, useState } from 'react';
import './App.css';
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage'; 
import SignUpPage from './components/SignUpPage'; 
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';


function App() {
  const AuthWrapper = () => {
    const location = useLocation();
    //const userLogged = JSON.parse(localStorage.getItem("userLogged"));
  
    return userLogged ? 
    <Outlet/>
    : (
        <Navigate to="/" replace state={{from:location}}/>
    );
  };

  const [userLogged, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("userLogged"))
  );
 // useEffect(() => {
 //   localStorage.setItem("userLogged", JSON.stringify(userLogged));
 // });//, [userLogged]);

  const logIn = () => {
    setUserLogged(true);
    localStorage.setItem("userLogged", true);
  };
  const logOut = () => {
    //console.log("In logout declaration");
    setUserLogged(false);
    localStorage.removeItem("userLogged");
  };
  //console.log(JSON.parse(localStorage.getItem("userLogged")));

  function handleLogout() {
      axios.get("http://127.0.0.1:8000/logout/")
      .then((response) => {
        console.log(response);
        logOut();
      })
      .catch(error => {
        console.log(error)
      });
  }

  function handleLogin() {
    try {
      logIn();
      <Navigate to="/"/>
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the Landing Page */}
          <Route path="/" element={<LandingPage handleLogout={handleLogout} userLogged={userLogged} />} />
          
          {/* Route for the About Page */}
          <Route path="/about" element={<AboutPage />} />

          {/* Route for the Sign Up Page */}
          <Route path="/signup" element={<SignUpPage />} /> 

          {/* Route for the Log In Page */}
          <Route path="/login" element={<LoginPage handleLogin={handleLogin}/>} />

          {/* Route for the Dashboard Page */}
          
          <Route path="/dashboard" element={<DashboardPage handleLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
